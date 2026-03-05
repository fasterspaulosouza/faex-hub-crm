import { ApiProperty } from '@nestjs/swagger'
import { IsJWT, IsNotEmpty, IsString, Length, Matches } from 'class-validator'

export class MfaBackupVerificarDto {
  @ApiProperty({
    description: 'Token MFA pendente recebido no login',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsJWT({ message: 'Token deve ser um JWT válido' })
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string

  @ApiProperty({
    description: 'Código de backup de 8 caracteres',
    example: 'A1B2C3D4',
  })
  @IsString({ message: 'Código de backup deve ser uma string' })
  @IsNotEmpty({ message: 'Código de backup é obrigatório' })
  @Length(8, 8, { message: 'Código de backup deve ter exatamente 8 caracteres' })
  @Matches(/^[A-Z0-9]{8}$/, {
    message: 'Código de backup deve conter apenas letras maiúsculas e números',
  })
  codigoBackup: string
}
