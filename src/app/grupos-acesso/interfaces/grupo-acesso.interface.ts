import { GrupoAcesso, GrupoAcessoMembro, GrupoAcessoPermissao, Modulo, Usuario } from '@prisma/client'
import { RespostaPaginada } from 'src/common/interfaces/paginated-response.interface'

export type GrupoAcessoListResponse = RespostaPaginada<GrupoAcesso>

export type GrupoAcessoCompleto = GrupoAcesso & {
  membros: (GrupoAcessoMembro & { usuario: Pick<Usuario, 'id' | 'nome' | 'email'> })[]
  permissoes: (GrupoAcessoPermissao & { modulo: Pick<Modulo, 'id' | 'nome' | 'descricao'> })[]
}
