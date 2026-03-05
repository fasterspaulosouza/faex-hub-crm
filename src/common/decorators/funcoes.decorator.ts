import { SetMetadata } from '@nestjs/common'
import { UsuarioFuncao } from '@prisma/client'

export const FUNCOES_KEY = 'funcoes'
export const Funcoes = (...funcoes: UsuarioFuncao[]) =>
  SetMetadata(FUNCOES_KEY, funcoes)
