import { IsInt, IsPositive } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class EnviarSolicitacaoDto {
  @ApiProperty({ description: 'ID do usuário que receberá a solicitação', example: 2 })
  @IsInt({ message: 'receptorId deve ser um número inteiro' })
  @IsPositive({ message: 'receptorId deve ser positivo' })
  @Type(() => Number)
  receptorId: number
}
