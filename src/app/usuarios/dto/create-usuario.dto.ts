import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  Genero,
  UsuarioStatus,
  UsuarioFuncao,
  Departamento,
} from '@prisma/client'
import { Type, Transform } from 'class-transformer'

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Nome completo do usuário.',
    example: 'Paulo Souza',
    minLength: 2,
    maxLength: 150,
  })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  @Length(2, 150, { message: 'O nome deve ter entre 2 e 150 caracteres.' })
  @Transform(({ value }) => value?.trim())
  nome: string

  @ApiProperty({
    description: 'Endereço de e-mail válido do usuário.',
    example: 'paulo.souza@email.com',
    maxLength: 150,
  })
  @IsEmail({}, { message: 'Deve ser um endereço de e-mail válido.' })
  @MaxLength(150, { message: 'O e-mail deve ter no máximo 150 caracteres.' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string

  @ApiProperty({
    description:
      'Senha do usuário. Deve conter no mínimo 6 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
    example: 'Senha@123',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
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
  senha: string

  @ApiPropertyOptional({
    description: 'Número de telefone do usuário.',
    example: '(11) 91234-5678',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string.' })
  @MaxLength(20, { message: 'O telefone deve ter no máximo 20 caracteres.' })
  @Transform(({ value }) => value?.trim())
  telefone?: string

  @ApiPropertyOptional({
    description: 'Número do documento (CPF, RG ou outro).',
    example: '123.456.789-00',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'O documento deve ser uma string.' })
  @MaxLength(20, { message: 'O documento deve ter no máximo 20 caracteres.' })
  @Transform(({ value }) => value?.trim())
  documento?: string

  @ApiPropertyOptional({
    description: 'Data de nascimento do usuário no formato ISO (YYYY-MM-DD).',
    example: '1995-08-15',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined
    const date = new Date(value)
    return isNaN(date.getTime()) ? value : date
  })
  aniversario?: Date

  @ApiPropertyOptional({
    description: 'Gênero do usuário.',
    example: 'MASCULINO',
    enum: Genero,
    required: false,
  })
  @IsOptional()
  @IsEnum(Genero, { message: 'Gênero deve ser MASCULINO, FEMININO ou OUTRO.' })
  genero?: Genero

  @ApiPropertyOptional({
    description: 'Anotações adicionais sobre o usuário.',
    example: 'Usuário com acesso administrativo.',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'A observação deve ser uma string.' })
  @MaxLength(500, {
    message: 'A observação deve ter no máximo 500 caracteres.',
  })
  @Transform(({ value }) => value?.trim())
  observacao?: string

  @ApiPropertyOptional({
    description: 'ID do endereço associado',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O ID do endereço deve ser um número inteiro.' })
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  enderecoId?: number

  @ApiPropertyOptional({
    description: 'URL da foto de perfil do usuário.',
    example: 'https://meuservidor.com/imagens/paulo.jpg',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'A URL da foto deve ser uma string.' })
  @MaxLength(255, {
    message: 'A URL da foto deve ter no máximo 255 caracteres.',
  })
  @Transform(({ value }) => value?.trim())
  foto?: string

  @ApiPropertyOptional({
    description: 'Status atual do usuário no sistema.',
    example: 'NOVO',
    enum: UsuarioStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(UsuarioStatus, {
    message:
      'Status deve ser um dos valores válidos: NOVO, ATIVO, INATIVO, PENDENTE, BLOQUEADO.',
  })
  status?: UsuarioStatus

  @ApiPropertyOptional({
    description: 'Função do usuário dentro do sistema.',
    example: 'PARCEIRO',
    enum: UsuarioFuncao,
    required: false,
  })
  @IsOptional()
  @IsEnum(UsuarioFuncao, {
    message:
      'Função deve ser um dos valores válidos: ADMIN, USUARIO, PARCEIRO, ORGANIZACAO.',
  })
  funcao?: UsuarioFuncao

  @ApiPropertyOptional({
    description: 'Departamento ao qual o usuário pertence.',
    example: 'SITE',
    enum: Departamento,
    required: false,
  })
  @IsOptional()
  @IsEnum(Departamento, {
    message:
      'Departamento deve ser um dos valores válidos definidos no sistema.',
  })
  departamento?: Departamento

  @ApiPropertyOptional({
    description: 'Indica se o usuário foi verificado.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'O campo verificado deve ser verdadeiro ou falso.' })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true
    if (value === 'false' || value === false) return false
    return value
  })
  verificado?: boolean

  @ApiPropertyOptional({
    description: 'Indica se o usuário está ativo no sistema.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso.' })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true
    if (value === 'false' || value === false) return false
    return value
  })
  ativo?: boolean
}
