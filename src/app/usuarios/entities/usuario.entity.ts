import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  Usuario as PrismaUsuario,
  UsuarioFuncao,
  UsuarioStatus,
  Genero,
  Departamento,
} from '@prisma/client'

export class UsuarioEntity implements Omit<PrismaUsuario, 'senha'> {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva Santos',
    maxLength: 150,
  })
  nome: string

  @ApiProperty({
    description: 'Endereço de e-mail do usuário',
    example: 'joao.silva@email.com',
    maxLength: 150,
  })
  email: string

  @ApiPropertyOptional({
    description: 'Número de telefone do usuário',
    example: '(11) 91234-5678',
    maxLength: 20,
    required: false,
  })
  telefone: string | null

  @ApiPropertyOptional({
    description: 'Número do documento (CPF, RG ou outro)',
    example: '123.456.789-00',
    maxLength: 20,
    required: false,
  })
  documento: string | null

  @ApiPropertyOptional({
    description: 'Data de nascimento do usuário',
    example: '1995-08-15T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  aniversario: Date | null

  @ApiPropertyOptional({
    description: 'Gênero do usuário',
    enum: Genero,
    example: 'MASCULINO',
    required: false,
  })
  genero: Genero | null

  @ApiPropertyOptional({
    description: 'Observações adicionais sobre o usuário',
    example: 'Usuário com acesso administrativo',
    maxLength: 500,
    required: false,
  })
  observacao: string | null

  @ApiPropertyOptional({
    description: 'ID do endereço associado ao usuário',
    example: 1,
    required: false,
  })
  enderecoId: number | null

  @ApiPropertyOptional({
    description: 'URL da foto de perfil do usuário',
    example: 'https://exemplo.com/fotos/joao.jpg',
    maxLength: 255,
    required: false,
  })
  foto: string | null

  @ApiProperty({
    description: 'Status atual do usuário no sistema',
    enum: UsuarioStatus,
    example: 'ATIVO',
  })
  status: UsuarioStatus

  @ApiProperty({
    description: 'Função do usuário no sistema',
    enum: UsuarioFuncao,
    example: 'PARCEIRO',
  })
  funcao: UsuarioFuncao

  @ApiPropertyOptional({
    description: 'Departamento ao qual o usuário pertence',
    enum: Departamento,
    example: 'SITE',
    required: false,
  })
  departamento: Departamento

  @ApiProperty({
    description: 'Indica se o usuário foi verificado',
    example: true,
  })
  verificado: boolean

  @ApiProperty({
    description: 'Indica se o usuário está ativo no sistema',
    example: true,
  })
  ativo: boolean

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Data da última atualização do usuário',
    example: '2024-01-20T15:45:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date

  @ApiPropertyOptional({
    description: 'Data de exclusão do usuário (soft delete)',
    example: null,
    type: 'string',
    format: 'date-time',
    required: false,
  })
  deletedAt: Date | null
}
