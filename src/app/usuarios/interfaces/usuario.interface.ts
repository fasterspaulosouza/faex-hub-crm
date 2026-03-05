import {
  Usuario,
  UsuarioFuncao,
  UsuarioStatus,
  Genero,
  Departamento,
} from '@prisma/client'
import { RespostaPaginada } from '../../../common/interfaces/paginated-response.interface'

// Interface para filtros de busca de usuários
export interface FiltrosUsuario {
  pagina?: number
  limite?: number
  nome?: string
  email?: string
  funcao?: UsuarioFuncao
  status?: UsuarioStatus
  genero?: Genero
  departamento?: Departamento
  ativo?: boolean
  dataInicial?: Date | string
  dataFinal?: Date | string
}

// Interface para resposta paginada de usuários (sem senha)
export type UsuarioSeguro = Omit<Usuario, 'senha'>
export type UsuarioListResponse = RespostaPaginada<UsuarioSeguro>

// Interface para estatísticas de usuários
export interface UsuarioStats {
  totalUsuarios: number
  usuariosAtivos: number
  usuariosInativos: number
  usuariosPorFuncao: Array<{
    funcao: UsuarioFuncao
    total: number
  }>
  usuariosPorStatus: Array<{
    status: UsuarioStatus
    total: number
  }>
  usuariosPorGenero: Array<{
    genero: Genero
    total: number
  }>
  usuariosPorDepartamento: Array<{
    departamento: Departamento
    total: number
  }>
  usuariosComEnderecos: number
  cadastrosRecentes: number // últimos 30 dias
}

// Interface para alteração de senha
export interface AlterarSenhaDto {
  senhaAtual: string
  novaSenha: string
  confirmarSenha?: string
}

// Interface para resposta de criação de usuário (com token se necessário)
export interface UsuarioCriadoResponse {
  usuario: UsuarioSeguro
  token?: string
  mensagem?: string
}

// Interface para busca por critérios específicos
export interface CriteriosBuscaUsuario {
  email?: string
  documento?: string
  telefone?: string
}

// Interface para dados de contato do usuário
export interface ContatoUsuario {
  email: string
  telefone?: string
  celular?: string
}

// Interface para endereço relacionado ao usuário
export interface EnderecoUsuario {
  id?: number
  codigoPostal?: string
  morada?: string
  localidade?: string
  freguesia?: string
  concelho?: string
  distrito?: string
}

// Interface para perfil completo do usuário
export interface PerfilUsuario extends UsuarioSeguro {
  endereco?: EnderecoUsuario
  estatisticas?: {
    ultimoLogin?: Date
    totalLogins?: number
    pedidosRealizados?: number
  }
}
