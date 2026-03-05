import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { VisibilidadeConhecimento } from '@prisma/client'
import { PrismaService } from 'src/common/modules/prisma/prisma.service'
import { BaseSearchService } from 'src/common/services/base-search.service'
import { CreateConhecimentoDto } from './dto/create-conhecimento.dto'
import { UpdateConhecimentoDto } from './dto/update-conhecimento.dto'
import { SearchConhecimentoDto } from './dto/search-conhecimento.dto'
import { ConhecimentoCompleto, ConhecimentoListResponse } from './interfaces/conhecimento.interface'

const AUTOR_SELECT = { id: true, nome: true, email: true, foto: true }

@Injectable()
export class ConhecimentoService {
  private readonly logger = new Logger(ConhecimentoService.name)

  constructor(private readonly prisma: PrismaService) {}

  async buscarComFiltros(searchDto: SearchConhecimentoDto): Promise<ConhecimentoListResponse> {
    const { visibilidade, ativo, ...opcoesBusca } = searchDto
    const camposBusca = ['titulo', 'descricao']
    const condicoesExtras: any[] = [{ ativo: true }]

    if (visibilidade) condicoesExtras.push({ visibilidade })
    if (ativo !== undefined) {
      condicoesExtras[0] = { ativo }
    }

    return BaseSearchService.executarBuscaCompleta(
      this.prisma.publicacaoConhecimento,
      opcoesBusca,
      camposBusca,
      condicoesExtras,
      { autor: { select: AUTOR_SELECT } },
    ) as Promise<ConhecimentoListResponse>
  }

  async buscarMeus(usuarioId: number, pagina = 1, limite = 10): Promise<ConhecimentoListResponse> {
    const skip = (pagina - 1) * limite
    const where = { autorId: usuarioId, ativo: true }

    const [data, total] = await Promise.all([
      this.prisma.publicacaoConhecimento.findMany({
        where,
        skip,
        take: limite,
        orderBy: { createdAt: 'desc' },
        include: { autor: { select: AUTOR_SELECT } },
      }),
      this.prisma.publicacaoConhecimento.count({ where }),
    ])

    return {
      dados: data as ConhecimentoCompleto[],
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    }
  }

  async buscar(id: number): Promise<ConhecimentoCompleto> {
    const publicacao = await this.prisma.publicacaoConhecimento.findFirst({
      where: { id, ativo: true },
      include: { autor: { select: AUTOR_SELECT } },
    })

    if (!publicacao) {
      throw new NotFoundException(`Publicação de conhecimento com ID ${id} não encontrada`)
    }

    return publicacao as ConhecimentoCompleto
  }

  async criar(usuarioId: number, dto: CreateConhecimentoDto) {
    try {
      return await this.prisma.publicacaoConhecimento.create({
        data: { ...dto, autorId: usuarioId },
        include: { autor: { select: AUTOR_SELECT } },
      })
    } catch (error) {
      this.logger.error(`Erro ao criar publicação de conhecimento: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao criar publicação de conhecimento')
    }
  }

  async atualizar(id: number, usuarioId: number, dto: UpdateConhecimentoDto) {
    const publicacao = await this.buscar(id)

    if (publicacao.autorId !== usuarioId) {
      throw new ForbiddenException('Apenas o autor pode editar esta publicação')
    }

    try {
      return await this.prisma.publicacaoConhecimento.update({
        where: { id },
        data: dto,
        include: { autor: { select: AUTOR_SELECT } },
      })
    } catch (error) {
      this.logger.error(`Erro ao atualizar publicação: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao atualizar publicação de conhecimento')
    }
  }

  async remover(id: number, usuarioId: number) {
    const publicacao = await this.buscar(id)

    if (publicacao.autorId !== usuarioId) {
      throw new ForbiddenException('Apenas o autor pode remover esta publicação')
    }

    try {
      await this.prisma.publicacaoConhecimento.update({
        where: { id },
        data: { ativo: false, deletedAt: new Date() },
      })
      return { mensagem: 'Publicação de conhecimento removida com sucesso' }
    } catch (error) {
      this.logger.error(`Erro ao remover publicação: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao remover publicação de conhecimento')
    }
  }
}
