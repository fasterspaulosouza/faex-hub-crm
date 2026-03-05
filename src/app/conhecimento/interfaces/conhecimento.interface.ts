import { PublicacaoConhecimento, Usuario } from '@prisma/client'
import { RespostaPaginada } from 'src/common/interfaces/paginated-response.interface'

type UsuarioResumido = Pick<Usuario, 'id' | 'nome' | 'email' | 'foto'>

export type ConhecimentoListResponse = RespostaPaginada<ConhecimentoCompleto>

export type ConhecimentoCompleto = PublicacaoConhecimento & {
  autor: UsuarioResumido
}
