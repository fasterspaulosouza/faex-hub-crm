import { IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator'
import { Type } from 'class-transformer'
import { NivelPermissao } from '@prisma/client'

export class AtribuirPermissaoDto {
  @IsNotEmpty({ message: 'ID do módulo é obrigatório' })
  @Type(() => Number)
  @IsInt({ message: 'ID do módulo deve ser um número inteiro' })
  @IsPositive({ message: 'ID do módulo deve ser um número positivo' })
  moduloId: number

  @IsNotEmpty({ message: 'Nível de permissão é obrigatório' })
  @IsEnum(NivelPermissao, {
    message: 'Nível deve ser um dos valores: NENHUM, LEITURA, ESCRITA, EXCLUSAO',
  })
  nivel: NivelPermissao
}
