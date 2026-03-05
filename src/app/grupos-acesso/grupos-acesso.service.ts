import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/common/modules/prisma/prisma.service'
import { BaseSearchService } from 'src/common/services/base-search.service'
import { CreateGrupoAcessoDto } from './dto/create-grupo-acesso.dto'
import { UpdateGrupoAcessoDto } from './dto/update-grupo-acesso.dto'
import { SearchGrupoAcessoDto } from './dto/search-grupo-acesso.dto'
import { AdicionarMembroDto } from './dto/adicionar-membro.dto'
import { AtribuirPermissaoDto } from './dto/atribuir-permissao.dto'
import { GrupoAcessoCompleto, GrupoAcessoListResponse } from './interfaces/grupo-acesso.interface'

@Injectable()
export class GruposAcessoService {
  private readonly logger = new Logger(GruposAcessoService.name)

  constructor(private readonly prisma: PrismaService) {}

  async buscarComFiltros(searchDto: SearchGrupoAcessoDto): Promise<GrupoAcessoListResponse> {
    const { ativo, ...opcoesBusca } = searchDto
    const camposBusca = ['nome', 'descricao']
    const condicoesExtras: any[] = []

    if (ativo !== undefined) {
      condicoesExtras.push({ ativo })
    }

    return await BaseSearchService.executarBuscaCompleta(
      this.prisma.grupoAcesso,
      opcoesBusca,
      camposBusca,
      condicoesExtras,
    )
  }

  async buscar(id: number): Promise<GrupoAcessoCompleto> {
    if (!id || id <= 0) {
      throw new BadRequestException('ID deve ser um número válido')
    }

    const grupo = await this.prisma.grupoAcesso.findFirst({
      where: { id, ativo: true },
      include: {
        membros: {
          include: { usuario: { select: { id: true, nome: true, email: true } } },
        },
        permissoes: {
          include: { modulo: { select: { id: true, nome: true, descricao: true } } },
        },
      },
    })

    if (!grupo) {
      throw new NotFoundException(`Grupo de acesso com ID ${id} não encontrado`)
    }

    return grupo as GrupoAcessoCompleto
  }

  async criar(dto: CreateGrupoAcessoDto) {
    const existente = await this.prisma.grupoAcesso.findFirst({
      where: { nome: dto.nome },
    })

    if (existente) {
      throw new ConflictException(`Já existe um grupo com o nome "${dto.nome}"`)
    }

    try {
      return await this.prisma.grupoAcesso.create({ data: dto })
    } catch (error) {
      this.logger.error(`Erro ao criar grupo de acesso: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao criar grupo de acesso')
    }
  }

  async atualizar(id: number, dto: UpdateGrupoAcessoDto) {
    await this.buscar(id)

    if (dto.nome) {
      const existente = await this.prisma.grupoAcesso.findFirst({
        where: {
          nome: dto.nome,
          id: { not: id },
        },
      })

      if (existente) {
        throw new ConflictException(`Já existe um grupo com o nome "${dto.nome}"`)
      }
    }

    try {
      return await this.prisma.grupoAcesso.update({ where: { id }, data: dto })
    } catch (error) {
      this.logger.error(`Erro ao atualizar grupo de acesso: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao atualizar grupo de acesso')
    }
  }

  async remover(id: number) {
    await this.buscar(id)

    try {
      return await this.prisma.grupoAcesso.update({
        where: { id },
        data: { ativo: false, deletedAt: new Date() },
      })
    } catch (error) {
      this.logger.error(`Erro ao remover grupo de acesso: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao remover grupo de acesso')
    }
  }

  async adicionarMembro(grupoId: number, dto: AdicionarMembroDto) {
    await this.buscar(grupoId)

    const usuario = await this.prisma.usuario.findFirst({
      where: { id: dto.usuarioId, ativo: true },
    })

    if (!usuario) {
      throw new NotFoundException(`Utilizador com ID ${dto.usuarioId} não encontrado`)
    }

    const membroExiste = await this.prisma.grupoAcessoMembro.findUnique({
      where: { grupoAcessoId_usuarioId: { grupoAcessoId: grupoId, usuarioId: dto.usuarioId } },
    })

    if (membroExiste) {
      throw new ConflictException('Utilizador já é membro deste grupo')
    }

    try {
      return await this.prisma.grupoAcessoMembro.create({
        data: { grupoAcessoId: grupoId, usuarioId: dto.usuarioId },
        include: { usuario: { select: { id: true, nome: true, email: true } } },
      })
    } catch (error) {
      this.logger.error(`Erro ao adicionar membro: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao adicionar membro')
    }
  }

  async removerMembro(grupoId: number, usuarioId: number) {
    await this.buscar(grupoId)

    const membro = await this.prisma.grupoAcessoMembro.findUnique({
      where: { grupoAcessoId_usuarioId: { grupoAcessoId: grupoId, usuarioId } },
    })

    if (!membro) {
      throw new NotFoundException('Utilizador não é membro deste grupo')
    }

    try {
      await this.prisma.grupoAcessoMembro.delete({
        where: { grupoAcessoId_usuarioId: { grupoAcessoId: grupoId, usuarioId } },
      })
      return { mensagem: 'Membro removido com sucesso' }
    } catch (error) {
      this.logger.error(`Erro ao remover membro: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao remover membro')
    }
  }

  async buscarMembros(grupoId: number) {
    await this.buscar(grupoId)

    return this.prisma.grupoAcessoMembro.findMany({
      where: { grupoAcessoId: grupoId },
      include: { usuario: { select: { id: true, nome: true, email: true, funcao: true } } },
    })
  }

  async atribuirPermissao(grupoId: number, dto: AtribuirPermissaoDto) {
    await this.buscar(grupoId)

    const modulo = await this.prisma.modulo.findFirst({
      where: { id: dto.moduloId, ativo: true },
    })

    if (!modulo) {
      throw new NotFoundException(`Módulo com ID ${dto.moduloId} não encontrado`)
    }

    try {
      return await this.prisma.grupoAcessoPermissao.upsert({
        where: { grupoAcessoId_moduloId: { grupoAcessoId: grupoId, moduloId: dto.moduloId } },
        create: { grupoAcessoId: grupoId, moduloId: dto.moduloId, nivel: dto.nivel },
        update: { nivel: dto.nivel },
        include: { modulo: { select: { id: true, nome: true, descricao: true } } },
      })
    } catch (error) {
      this.logger.error(`Erro ao atribuir permissão: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao atribuir permissão')
    }
  }

  async removerPermissao(grupoId: number, moduloId: number) {
    await this.buscar(grupoId)

    const permissao = await this.prisma.grupoAcessoPermissao.findUnique({
      where: { grupoAcessoId_moduloId: { grupoAcessoId: grupoId, moduloId } },
    })

    if (!permissao) {
      throw new NotFoundException('Permissão não encontrada para este grupo e módulo')
    }

    try {
      await this.prisma.grupoAcessoPermissao.delete({
        where: { grupoAcessoId_moduloId: { grupoAcessoId: grupoId, moduloId } },
      })
      return { mensagem: 'Permissão removida com sucesso' }
    } catch (error) {
      this.logger.error(`Erro ao remover permissão: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao remover permissão')
    }
  }

  async buscarPermissoes(grupoId: number) {
    await this.buscar(grupoId)

    return this.prisma.grupoAcessoPermissao.findMany({
      where: { grupoAcessoId: grupoId },
      include: { modulo: { select: { id: true, nome: true, descricao: true } } },
    })
  }
}
