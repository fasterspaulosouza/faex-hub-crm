import { Amizade, AmizadeStatus, Usuario } from '@prisma/client'
import { RespostaPaginada } from 'src/common/interfaces/paginated-response.interface'

export type AmizadeListResponse = RespostaPaginada<AmizadeCompleta>

export type AmizadeCompleta = Amizade & {
  solicitante: Pick<Usuario, 'id' | 'nome' | 'email' | 'foto'>
  receptor: Pick<Usuario, 'id' | 'nome' | 'email' | 'foto'>
}

export interface FiltrosAmizade {
  status?: AmizadeStatus
  pagina?: number
  limite?: number
}
