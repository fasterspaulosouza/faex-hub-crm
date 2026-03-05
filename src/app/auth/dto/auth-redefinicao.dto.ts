import { ApiProperty } from '@nestjs/swagger'
import {
  IsJWT,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator'

export class AuthRedefinicaoDTO {
  @ApiProperty({
    description:
      'Nova senha (mínimo 8 caracteres, deve conter ao menos uma letra maiúscula, minúscula, número e caractere especial)',
    example: 'NovaSenha@123',
    minLength: 8,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Senha deve conter ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
  })
  senha: string

  @ApiProperty({
    description: 'Token JWT para redefinição de senha',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsJWT({ message: 'Token deve ser um JWT válido' })
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string
}
