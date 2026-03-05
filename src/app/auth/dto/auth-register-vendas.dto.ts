import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateAuthVendasDto {
  @ApiProperty({
    description: 'Nome completo do usuário.',
    example: 'Paulo Souza',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 150)
  nome: string

  @ApiProperty({
    description: 'Endereço de e-mail válido do usuário.',
    example: 'paulo.souza@email.com',
  })
  @IsEmail()
  @MaxLength(150)
  email: string
}
