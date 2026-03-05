import { ApiProperty } from '@nestjs/swagger'
import { IsJWT, IsNotEmpty, IsString, Length, Matches } from 'class-validator'

export class MfaVerificarDto {
  @ApiProperty({
    description: 'Token MFA pendente recebido no login',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsJWT({ message: 'Token deve ser um JWT válido' })
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string

  @ApiProperty({
    description: 'Código TOTP de 6 dígitos do aplicativo autenticador',
    example: '123456',
  })
  @IsString({ message: 'Código deve ser uma string' })
  @IsNotEmpty({ message: 'Código é obrigatório' })
  @Length(6, 6, { message: 'Código deve ter exatamente 6 dígitos' })
  @Matches(/^\d{6}$/, { message: 'Código deve conter apenas números' })
  codigo: string
}
