import {
  Publicacao,
  PublicacaoComentario,
  PublicacaoCurtida,
  Usuario,
} from '@prisma/client'
import { RespostaPaginada } from 'src/common/interfaces/paginated-response.interface'

const usuarioSelect = { id: true, nome: true, email: true, foto: true }
type UsuarioResumido = Pick<Usuario, 'id' | 'nome' | 'email' | 'foto'>

export type PublicacaoListResponse = RespostaPaginada<PublicacaoCompleta>

export type PublicacaoCompleta = Publicacao & {
  autor: UsuarioResumido
  _count: { comentarios: number; curtidas: number }
}

export type PublicacaoDetalhada = Publicacao & {
  autor: UsuarioResumido
  comentarios: (PublicacaoComentario & { autor: UsuarioResumido })[]
  curtidas: (PublicacaoCurtida & { usuario: UsuarioResumido })[]
  _count: { comentarios: number; curtidas: number }
}
