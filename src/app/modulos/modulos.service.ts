import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/common/modules/prisma/prisma.service'
import { BaseSearchService } from 'src/common/services/base-search.service'
import { CreateModuloDto } from './dto/create-modulo.dto'
import { UpdateModuloDto } from './dto/update-modulo.dto'
import { SearchModuloDto } from './dto/search-modulo.dto'
import { ModuloListResponse } from './interfaces/modulo.interface'

@Injectable()
export class ModulosService {
  private readonly logger = new Logger(ModulosService.name)

  constructor(private readonly prisma: PrismaService) {}

  async buscarComFiltros(searchDto: SearchModuloDto): Promise<ModuloListResponse> {
    const { ativo, ...opcoesBusca } = searchDto
    const camposBusca = ['nome', 'descricao']
    const condicoesExtras: any[] = []

    if (ativo !== undefined) {
      condicoesExtras.push({ ativo })
    }

    return await BaseSearchService.executarBuscaCompleta(
      this.prisma.modulo,
      opcoesBusca,
      camposBusca,
      condicoesExtras,
    )
  }

  async buscar(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID deve ser um número válido')
    }

    const modulo = await this.prisma.modulo.findFirst({
      where: { id, ativo: true },
    })

    if (!modulo) {
      throw new NotFoundException(`Módulo com ID ${id} não encontrado`)
    }

    return modulo
  }

  async criar(dto: CreateModuloDto) {
    const existente = await this.prisma.modulo.findFirst({
      where: { nome: dto.nome },
    })

    if (existente) {
      throw new ConflictException(`Já existe um módulo com o nome "${dto.nome}"`)
    }

    try {
      return await this.prisma.modulo.create({ data: dto })
    } catch (error) {
      this.logger.error(`Erro ao criar módulo: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao criar módulo')
    }
  }

  async atualizar(id: number, dto: UpdateModuloDto) {
    await this.buscar(id)

    if (dto.nome) {
      const existente = await this.prisma.modulo.findFirst({
        where: {
          nome: dto.nome,
          id: { not: id },
        },
      })

      if (existente) {
        throw new ConflictException(`Já existe um módulo com o nome "${dto.nome}"`)
      }
    }

    try {
      return await this.prisma.modulo.update({ where: { id }, data: dto })
    } catch (error) {
      this.logger.error(`Erro ao atualizar módulo: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao atualizar módulo')
    }
  }

  async remover(id: number) {
    await this.buscar(id)

    try {
      return await this.prisma.modulo.update({
        where: { id },
        data: { ativo: false, deletedAt: new Date() },
      })
    } catch (error) {
      this.logger.error(`Erro ao remover módulo: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao remover módulo')
    }
  }
}
