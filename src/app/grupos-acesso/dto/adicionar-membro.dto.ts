import { IsInt, IsNotEmpty, IsPositive } from 'class-validator'
import { Type } from 'class-transformer'

export class AdicionarMembroDto {
  @IsNotEmpty({ message: 'ID do utilizador é obrigatório' })
  @Type(() => Number)
  @IsInt({ message: 'ID do utilizador deve ser um número inteiro' })
  @IsPositive({ message: 'ID do utilizador deve ser um número positivo' })
  usuarioId: number
}
