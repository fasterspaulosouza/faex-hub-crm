import { BadRequestException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { OpcoesBusca } from '../interfaces/paginated-response.interface'

export class BaseSearchService {
  /**
   * Cria filtro de data a partir de strings de data (YYYY-MM-DD)
   * Garante que as datas sejam interpretadas no timezone local
   */
  static criarFiltroData(
    dataInicio?: string,
    dataFim?: string,
  ): Prisma.DateTimeFilter | undefined {
    if (!dataInicio && !dataFim) {
      return undefined
    }

    const dateFilter: Prisma.DateTimeFilter = {}

    if (dataInicio) {
      // Validar formato da data
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dataInicio)) {
        throw new BadRequestException(
          'Data início deve ter o formato YYYY-MM-DD',
        )
      }
      // Criar data no timezone local, não UTC
      const [year, month, day] = dataInicio.split('-').map(Number)
      const startDate = new Date(year, month - 1, day, 0, 0, 0, 0) // Início do dia no timezone local
      dateFilter.gte = startDate
    }

    if (dataFim) {
      // Validar formato da data
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dataFim)) {
        throw new BadRequestException('Data fim deve ter o formato YYYY-MM-DD')
      }
      // Criar data no timezone local, não UTC
      const [year, month, day] = dataFim.split('-').map(Number)
      const endDate = new Date(year, month - 1, day, 23, 59, 59, 999) // Fim do dia no timezone local
      dateFilter.lte = endDate
    }

    return dateFilter
  }

  /**
   * Cria filtro de busca de texto para múltiplos campos
   * @param termoBusca Termo de busca
   * @param camposBusca Array de campos para busca (ex: ['nome', 'email', 'telefone'])
   * @returns Condição OR para busca
   */
  static criarFiltroBuscaTexto(
    termoBusca: string | undefined,
    camposBusca: string[],
  ): any {
    if (!termoBusca?.trim() || !camposBusca.length) {
      return undefined
    }

    const termo = termoBusca.trim()
    return {
      OR: camposBusca.map((campo) => ({
        [campo]: { contains: termo },
      })),
    }
  }

  /**
   * Combina condições de busca usando AND
   * @param condicaoBase Condições base (ex: { ativo: true })
   * @param condicoesAdicionais Array de condições adicionais
   * @returns Objeto where combinado
   */
  static combinarCondicoesBusca(
    condicaoBase: any,
    condicoesAdicionais: any[],
  ): any {
    const condicoesValidas = condicoesAdicionais.filter(
      (condicao) => condicao !== undefined,
    )

    if (condicoesValidas.length === 0) {
      return condicaoBase
    }

    return {
      ...condicaoBase,
      AND: condicoesValidas,
    }
  }

  /**
   * Valida e normaliza parâmetros de paginação
   * @param pagina Página (padrão: 1)
   * @param limite Limite por página (padrão: 10, máximo: 100)
   * @returns Objeto com skip, take, pagina e limite normalizados
   */
  static normalizarPaginacao(pagina = 1, limite = 10) {
    const paginaNormalizada = Math.max(1, Number(pagina) || 1)
    const limiteNormalizado = Math.min(100, Math.max(1, Number(limite) || 10))
    const skip = (paginaNormalizada - 1) * limiteNormalizado

    return {
      skip,
      take: limiteNormalizado,
      pagina: paginaNormalizada,
      limite: limiteNormalizado,
    }
  }

  /**
   * Cria objeto de resposta paginada
   * @param dados Array de dados retornados
   * @param total Total de registros
   * @param pagina Página atual
   * @param limite Limite por página
   * @returns Objeto com dados e informações de paginação
   */
  static criarRespostaPaginada<T>(
    dados: T[],
    total: number,
    pagina: number,
    limite: number,
  ) {
    return {
      dados,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    }
  }

  /**
   * Processa opções de busca completa unificada
   * @param opcoes Opções de busca contendo paginação, filtros de data e termo de busca
   * @param camposBusca Array de campos para busca de texto
   * @param condicoesExtras Condições extras específicas do módulo
   * @returns Objeto com condições normalizadas e paginação
   */
  static processarOpcoesBusca(
    opcoes: OpcoesBusca,
    camposBusca: string[] = [],
    condicoesExtras: any[] = [],
  ) {
    const {
      pagina = 1,
      limite = 10,
      buscaPor,
      dataInicio,
      dataFim,
      ...outrasOpcoes
    } = opcoes

    // Normalizar paginação
    const paginacao = this.normalizarPaginacao(Number(pagina), Number(limite))

    // Criar filtros
    const filtroData = this.criarFiltroData(dataInicio, dataFim)
    const filtroBusca = this.criarFiltroBuscaTexto(buscaPor, camposBusca)

    // Condições base
    const condicaoBase = { ativo: true }

    // Combinar todas as condições
    const condicoesValidas = [
      filtroData ? { createdAt: filtroData } : undefined,
      filtroBusca,
      ...condicoesExtras,
    ].filter((condicao) => condicao !== undefined)

    const whereConditions = this.combinarCondicoesBusca(
      condicaoBase,
      condicoesValidas,
    )

    return {
      paginacao,
      whereConditions,
      outrasOpcoes,
    }
  }

  /**
   * Executa busca completa padronizada
   * @param prismaModel Model do Prisma para executar a busca
   * @param opcoes Opções de busca
   * @param camposBusca Campos para busca de texto
   * @param condicoesExtras Condições extras específicas
   * @param includeRelations Relações a incluir na busca
   * @returns Promise com resposta paginada
   */
  static async executarBuscaCompleta<T>(
    prismaModel: any,
    opcoes: OpcoesBusca,
    camposBusca: string[] = [],
    condicoesExtras: any[] = [],
    includeRelations: any = {},
  ): Promise<{
    dados: T[]
    total: number
    pagina: number
    limite: number
    totalPaginas: number
  }> {
    const { paginacao, whereConditions } = this.processarOpcoesBusca(
      opcoes,
      camposBusca,
      condicoesExtras,
    )

    const { skip, take, pagina, limite } = paginacao

    // Executar busca e contagem em paralelo
    const [dados, total] = await Promise.all([
      prismaModel.findMany({
        where: whereConditions,
        skip,
        take,
        include: includeRelations,
        orderBy: { createdAt: 'desc' },
      }) as Promise<T[]>,
      prismaModel.count({
        where: whereConditions,
      }) as Promise<number>,
    ])

    return this.criarRespostaPaginada(dados, total, pagina, limite)
  }
}
