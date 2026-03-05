import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class AuthEsqueciSenhaDTO {
  @ApiProperty({
    description: 'Email do usuário para recuperação de senha',
    example: 'usuario@faexhub.org.br',
    format: 'email',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string
}
