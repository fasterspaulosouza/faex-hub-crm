import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { AmizadeStatus } from '@prisma/client'
import { PrismaService } from 'src/common/modules/prisma/prisma.service'
import { EnviarSolicitacaoDto } from './dto/enviar-solicitacao.dto'
import { AmizadeCompleta, AmizadeListResponse } from './interfaces/amizade.interface'

const USUARIO_SELECT = { id: true, nome: true, email: true, foto: true }

@Injectable()
export class AmizadesService {
  private readonly logger = new Logger(AmizadesService.name)

  constructor(private readonly prisma: PrismaService) {}

  async buscarAmizades(usuarioId: number, pagina = 1, limite = 10): Promise<AmizadeListResponse> {
    const skip = (pagina - 1) * limite

    const where = {
      status: AmizadeStatus.ACEITO,
      OR: [{ solicitanteId: usuarioId }, { receptorId: usuarioId }],
    }

    const [data, total] = await Promise.all([
      this.prisma.amizade.findMany({
        where,
        skip,
        take: limite,
        orderBy: { updatedAt: 'desc' },
        include: {
          solicitante: { select: USUARIO_SELECT },
          receptor: { select: USUARIO_SELECT },
        },
      }),
      this.prisma.amizade.count({ where }),
    ])

    return {
      dados: data as AmizadeCompleta[],
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    }
  }

  async buscarPendentes(usuarioId: number) {
    return this.prisma.amizade.findMany({
      where: { receptorId: usuarioId, status: AmizadeStatus.PENDENTE },
      orderBy: { createdAt: 'desc' },
      include: {
        solicitante: { select: USUARIO_SELECT },
        receptor: { select: USUARIO_SELECT },
      },
    })
  }

  async buscarEnviadas(usuarioId: number) {
    return this.prisma.amizade.findMany({
      where: { solicitanteId: usuarioId, status: AmizadeStatus.PENDENTE },
      orderBy: { createdAt: 'desc' },
      include: {
        receptor: { select: USUARIO_SELECT },
      },
    })
  }

  async enviarSolicitacao(usuarioId: number, dto: EnviarSolicitacaoDto) {
    if (usuarioId === dto.receptorId) {
      throw new BadRequestException('Não é possível enviar solicitação para si mesmo')
    }

    const receptor = await this.prisma.usuario.findFirst({
      where: { id: dto.receptorId, ativo: true },
    })

    if (!receptor) {
      throw new NotFoundException(`Usuário com ID ${dto.receptorId} não encontrado`)
    }

    const existente = await this.prisma.amizade.findFirst({
      where: {
        OR: [
          { solicitanteId: usuarioId, receptorId: dto.receptorId },
          { solicitanteId: dto.receptorId, receptorId: usuarioId },
        ],
      },
    })

    if (existente) {
      throw new ConflictException('Já existe uma solicitação ou amizade com este usuário')
    }

    try {
      return await this.prisma.amizade.create({
        data: { solicitanteId: usuarioId, receptorId: dto.receptorId },
        include: {
          solicitante: { select: USUARIO_SELECT },
          receptor: { select: USUARIO_SELECT },
        },
      })
    } catch (error) {
      this.logger.error(`Erro ao enviar solicitação: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao enviar solicitação de amizade')
    }
  }

  async aceitarSolicitacao(id: number, usuarioId: number) {
    const amizade = await this.prisma.amizade.findUnique({ where: { id } })

    if (!amizade || amizade.status !== AmizadeStatus.PENDENTE) {
      throw new NotFoundException('Solicitação de amizade não encontrada ou já processada')
    }

    if (amizade.receptorId !== usuarioId) {
      throw new ForbiddenException('Apenas o receptor pode aceitar esta solicitação')
    }

    return this.prisma.amizade.update({
      where: { id },
      data: { status: AmizadeStatus.ACEITO },
      include: {
        solicitante: { select: USUARIO_SELECT },
        receptor: { select: USUARIO_SELECT },
      },
    })
  }

  async rejeitarSolicitacao(id: number, usuarioId: number) {
    const amizade = await this.prisma.amizade.findUnique({ where: { id } })

    if (!amizade || amizade.status !== AmizadeStatus.PENDENTE) {
      throw new NotFoundException('Solicitação de amizade não encontrada ou já processada')
    }

    if (amizade.receptorId !== usuarioId) {
      throw new ForbiddenException('Apenas o receptor pode rejeitar esta solicitação')
    }

    return this.prisma.amizade.update({
      where: { id },
      data: { status: AmizadeStatus.REJEITADO },
      include: {
        solicitante: { select: USUARIO_SELECT },
        receptor: { select: USUARIO_SELECT },
      },
    })
  }

  async remover(id: number, usuarioId: number) {
    const amizade = await this.prisma.amizade.findUnique({ where: { id } })

    if (!amizade) {
      throw new NotFoundException('Amizade/solicitação não encontrada')
    }

    if (amizade.solicitanteId !== usuarioId && amizade.receptorId !== usuarioId) {
      throw new ForbiddenException('Sem permissão para remover esta amizade')
    }

    try {
      await this.prisma.amizade.delete({ where: { id } })
      return { mensagem: 'Amizade removida com sucesso' }
    } catch (error) {
      this.logger.error(`Erro ao remover amizade: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao remover amizade')
    }
  }
}
