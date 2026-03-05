import { SetMetadata } from '@nestjs/common'
import { NivelPermissao } from '@prisma/client'

export const PERMISSAO_KEY = 'permissao'

export const Permissao = (modulo: string, nivel: NivelPermissao) =>
  SetMetadata(PERMISSAO_KEY, { modulo, nivel })
