import { ApiProperty } from '@nestjs/swagger'

export class AuthLoginResponseDTO {
  @ApiProperty({
    description: 'Token de acesso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string

  @ApiProperty({
    description: 'Tipo do token',
    example: 'Bearer',
  })
  tokenType: string

  @ApiProperty({
    description: 'Tempo de expiração do token em segundos',
    example: 86400,
  })
  expiresIn: number

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      nome: { type: 'string', example: 'João Silva' },
      email: { type: 'string', example: 'joao@faexhub.org.br' },
    },
  })
  usuario: {
    id: number
    nome: string
    email: string
  }
}

export class AuthCadastroResponseDTO {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Usuário cadastrado com sucesso!',
  })
  mensagem: string

  @ApiProperty({
    description: 'Token para redefinição de senha',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string
}

export class MfaPendenteResponseDTO {
  @ApiProperty({
    description: 'Indica que verificação MFA é necessária',
    example: true,
  })
  mfaRequerido: true

  @ApiProperty({
    description: 'Token temporário para verificação MFA (5 minutos)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  mfaPendenteToken: string

  @ApiProperty({
    description: 'Mensagem informativa',
    example: 'Verificação MFA necessária. Envie o código TOTP.',
  })
  mensagem: string
}

export class AuthEsqueciSenhaResponseDTO {
  @ApiProperty({
    description: 'Indica se o email foi enviado com sucesso',
    example: true,
  })
  sucesso: boolean

  @ApiProperty({
    description: 'Mensagem de confirmação',
    example: 'Email de recuperação enviado com sucesso!',
  })
  mensagem: string
}

export class AuthVerificarCodigoResponseDTO {
  @ApiProperty({
    description: 'Token para redefinição de senha',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string
}
