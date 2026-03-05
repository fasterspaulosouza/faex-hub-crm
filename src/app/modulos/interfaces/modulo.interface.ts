import { Modulo } from '@prisma/client'
import { RespostaPaginada } from 'src/common/interfaces/paginated-response.interface'

export type ModuloListResponse = RespostaPaginada<Modulo>
