import { PartialType, ApiPropertyOptional } from '@nestjs/swagger'
import { CreateUsuarioDto } from './create-usuario.dto'
import { IsOptional, IsString, IsStrongPassword } from 'class-validator'

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @ApiPropertyOptional({
    description:
      'Nova senha do usuário. Se informada, deve seguir os mesmos critérios de segurança da criação.',
    example: 'NovaSenha@456',
    minLength: 6,
  })
  @IsOptional()
  @IsString({ message: 'A senha deve ser uma string.' })
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'A senha deve conter no mínimo 6 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
    },
  )
  senha?: string
}
