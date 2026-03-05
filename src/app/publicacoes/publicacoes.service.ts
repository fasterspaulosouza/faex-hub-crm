import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/common/modules/prisma/prisma.service'
import { BaseSearchService } from 'src/common/services/base-search.service'
import { CreatePublicacaoDto } from './dto/create-publicacao.dto'
import { UpdatePublicacaoDto } from './dto/update-publicacao.dto'
import { SearchPublicacaoDto } from './dto/search-publicacao.dto'
import { CreateComentarioDto } from './dto/create-comentario.dto'
import { PublicacaoCompleta, PublicacaoDetalhada, PublicacaoListResponse } from './interfaces/publicacao.interface'

const AUTOR_SELECT = { id: true, nome: true, email: true, foto: true }
const COUNT_INCLUDE = { _count: { select: { comentarios: true, curtidas: true } } }

@Injectable()
export class PublicacoesService {
  private readonly logger = new Logger(PublicacoesService.name)

  constructor(private readonly prisma: PrismaService) {}

  async buscarComFiltros(searchDto: SearchPublicacaoDto): Promise<PublicacaoListResponse> {
    const { tipo, visibilidade, ativo, ...opcoesBusca } = searchDto
    const camposBusca = ['conteudo']
    const condicoesExtras: any[] = [{ ativo: true }]

    if (tipo) condicoesExtras.push({ tipo })
    if (visibilidade) condicoesExtras.push({ visibilidade })
    if (ativo !== undefined) {
      condicoesExtras[0] = { ativo }
    }

    return BaseSearchService.executarBuscaCompleta(
      this.prisma.publicacao,
      opcoesBusca,
      camposBusca,
      condicoesExtras,
      { autor: { select: AUTOR_SELECT }, ...COUNT_INCLUDE },
    ) as Promise<PublicacaoListResponse>
  }

  async buscarMinhas(usuarioId: number, pagina = 1, limite = 10): Promise<PublicacaoListResponse> {
    const skip = (pagina - 1) * limite
    const where = { autorId: usuarioId, ativo: true }

    const [data, total] = await Promise.all([
      this.prisma.publicacao.findMany({
        where,
        skip,
        take: limite,
        orderBy: { createdAt: 'desc' },
        include: { autor: { select: AUTOR_SELECT }, ...COUNT_INCLUDE },
      }),
      this.prisma.publicacao.count({ where }),
    ])

    return {
      dados: data as PublicacaoCompleta[],
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    }
  }

  async buscar(id: number): Promise<PublicacaoDetalhada> {
    const publicacao = await this.prisma.publicacao.findFirst({
      where: { id, ativo: true },
      include: {
        autor: { select: AUTOR_SELECT },
        comentarios: {
          where: { ativo: true },
          orderBy: { createdAt: 'asc' },
          include: { autor: { select: AUTOR_SELECT } },
        },
        curtidas: {
          include: { usuario: { select: AUTOR_SELECT } },
        },
        ...COUNT_INCLUDE,
      },
    })

    if (!publicacao) {
      throw new NotFoundException(`Publicação com ID ${id} não encontrada`)
    }

    return publicacao as PublicacaoDetalhada
  }

  async criar(usuarioId: number, dto: CreatePublicacaoDto) {
    try {
      return await this.prisma.publicacao.create({
        data: { ...dto, autorId: usuarioId },
        include: { autor: { select: AUTOR_SELECT }, ...COUNT_INCLUDE },
      })
    } catch (error) {
      this.logger.error(`Erro ao criar publicação: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao criar publicação')
    }
  }

  async atualizar(id: number, usuarioId: number, dto: UpdatePublicacaoDto) {
    const publicacao = await this.prisma.publicacao.findFirst({ where: { id, ativo: true } })

    if (!publicacao) {
      throw new NotFoundException(`Publicação com ID ${id} não encontrada`)
    }

    if (publicacao.autorId !== usuarioId) {
      throw new ForbiddenException('Apenas o autor pode editar esta publicação')
    }

    try {
      return await this.prisma.publicacao.update({
        where: { id },
        data: dto,
        include: { autor: { select: AUTOR_SELECT }, ...COUNT_INCLUDE },
      })
    } catch (error) {
      this.logger.error(`Erro ao atualizar publicação: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao atualizar publicação')
    }
  }

  async remover(id: number, usuarioId: number) {
    const publicacao = await this.prisma.publicacao.findFirst({ where: { id, ativo: true } })

    if (!publicacao) {
      throw new NotFoundException(`Publicação com ID ${id} não encontrada`)
    }

    if (publicacao.autorId !== usuarioId) {
      throw new ForbiddenException('Apenas o autor pode remover esta publicação')
    }

    try {
      await this.prisma.publicacao.update({
        where: { id },
        data: { ativo: false, deletedAt: new Date() },
      })
      return { mensagem: 'Publicação removida com sucesso' }
    } catch (error) {
      this.logger.error(`Erro ao remover publicação: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao remover publicação')
    }
  }

  // ── Comentários ──────────────────────────────────────────────

  async buscarComentarios(publicacaoId: number) {
    await this.buscar(publicacaoId)

    return this.prisma.publicacaoComentario.findMany({
      where: { publicacaoId, ativo: true },
      orderBy: { createdAt: 'asc' },
      include: { autor: { select: AUTOR_SELECT } },
    })
  }

  async adicionarComentario(publicacaoId: number, usuarioId: number, dto: CreateComentarioDto) {
    await this.buscar(publicacaoId)

    try {
      return await this.prisma.publicacaoComentario.create({
        data: { publicacaoId, autorId: usuarioId, conteudo: dto.conteudo },
        include: { autor: { select: AUTOR_SELECT } },
      })
    } catch (error) {
      this.logger.error(`Erro ao adicionar comentário: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao adicionar comentário')
    }
  }

  async removerComentario(publicacaoId: number, comentarioId: number, usuarioId: number) {
    const publicacao = await this.buscar(publicacaoId)

    const comentario = await this.prisma.publicacaoComentario.findFirst({
      where: { id: comentarioId, publicacaoId, ativo: true },
    })

    if (!comentario) {
      throw new NotFoundException('Comentário não encontrado')
    }

    const isAutorComentario = comentario.autorId === usuarioId
    const isAutorPublicacao = publicacao.autorId === usuarioId

    if (!isAutorComentario && !isAutorPublicacao) {
      throw new ForbiddenException('Sem permissão para remover este comentário')
    }

    try {
      await this.prisma.publicacaoComentario.update({
        where: { id: comentarioId },
        data: { ativo: false, deletedAt: new Date() },
      })
      return { mensagem: 'Comentário removido com sucesso' }
    } catch (error) {
      this.logger.error(`Erro ao remover comentário: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao remover comentário')
    }
  }

  // ── Curtidas ─────────────────────────────────────────────────

  async buscarCurtidas(publicacaoId: number) {
    await this.buscar(publicacaoId)

    return this.prisma.publicacaoCurtida.findMany({
      where: { publicacaoId },
      include: { usuario: { select: AUTOR_SELECT } },
    })
  }

  async toggleCurtida(publicacaoId: number, usuarioId: number) {
    await this.buscar(publicacaoId)

    const curtidaExiste = await this.prisma.publicacaoCurtida.findUnique({
      where: { publicacaoId_usuarioId: { publicacaoId, usuarioId } },
    })

    if (curtidaExiste) {
      await this.prisma.publicacaoCurtida.delete({
        where: { publicacaoId_usuarioId: { publicacaoId, usuarioId } },
      })
      return { curtido: false, mensagem: 'Curtida removida' }
    }

    await this.prisma.publicacaoCurtida.create({
      data: { publicacaoId, usuarioId },
    })
    return { curtido: true, mensagem: 'Publicação curtida' }
  }
}
