export interface RespostaPaginada<T> {
  dados: T[]
  total: number
  pagina: number
  limite: number
  totalPaginas: number
}

export interface OpcoesBusca {
  /** Página da paginação (padrão: 1) */
  pagina?: number
  /** Limite de registros por página (padrão: 10, máximo: 100) */
  limite?: number
  /** Termo de busca geral para pesquisar em múltiplos campos */
  buscaPor?: string
  /** Data de início para filtro (YYYY-MM-DD) */
  dataInicio?: string
  /** Data de fim para filtro (YYYY-MM-DD) */
  dataFim?: string
  /** Propriedades extras específicas de cada módulo */
  [key: string]: any
}

export interface ResultadoBuscaCompleta {
  /** Condições de paginação normalizadas */
  paginacao: {
    skip: number
    take: number
    pagina: number
    limite: number
  }
  /** Condições WHERE combinadas para o Prisma */
  whereConditions: any
  /** Outras opções não processadas */
  outrasOpcoes: any
}
