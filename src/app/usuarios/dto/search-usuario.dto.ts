import { IsOptional, IsEnum, IsBoolean } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  UsuarioFuncao,
  UsuarioStatus,
  Genero,
  Departamento,
} from '@prisma/client'
import { BaseSearchDto } from '../../../common/dto/base-search.dto'

export class SearchUsuarioDto extends BaseSearchDto {
  @ApiPropertyOptional({
    description: 'Filtrar por função do usuário',
    enum: UsuarioFuncao,
    example: 'PARCEIRO',
  })
  @IsOptional()
  @IsEnum(UsuarioFuncao, {
    message:
      'Função deve ser um dos valores válidos: ADMIN, USUARIO, PARCEIRO, ORGANIZACAO.',
  })
  funcao?: UsuarioFuncao

  @ApiPropertyOptional({
    description: 'Filtrar por status do usuário',
    enum: UsuarioStatus,
    example: 'ATIVO',
  })
  @IsOptional()
  @IsEnum(UsuarioStatus, {
    message: 'Status deve ser um dos valores válidos do sistema.',
  })
  status?: UsuarioStatus

  @ApiPropertyOptional({
    description: 'Filtrar por gênero do usuário',
    enum: Genero,
    example: 'MASCULINO',
  })
  @IsOptional()
  @IsEnum(Genero, {
    message: 'Gênero deve ser MASCULINO, FEMININO ou OUTRO.',
  })
  genero?: Genero

  @ApiPropertyOptional({
    description: 'Filtrar por departamento',
    enum: Departamento,
    example: 'SITE',
  })
  @IsOptional()
  @IsEnum(Departamento, {
    message: 'Departamento deve ser um dos valores válidos.',
  })
  departamento?: Departamento

  @ApiPropertyOptional({
    description: 'Filtrar usuários ativos ou inativos',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso.' })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true
    if (value === 'false' || value === false) return false
    return value
  })
  ativo?: boolean

  @ApiPropertyOptional({
    description: 'Filtrar usuários verificados ou não verificados',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'O campo verificado deve ser verdadeiro ou falso.' })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true
    if (value === 'false' || value === false) return false
    return value
  })
  verificado?: boolean
}
