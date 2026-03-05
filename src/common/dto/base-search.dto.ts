import {
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class BaseSearchDto {
  @ApiPropertyOptional({
    description: 'Termo de busca geral para pesquisar em múltiplos campos',
    example: 'João Silva',
  })
  @IsOptional()
  @IsString({ message: 'Busca por deve ser uma string' })
  buscaPor?: string

  @ApiPropertyOptional({
    description: 'Data de início para filtro por data de cadastro (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data início deve ter o formato YYYY-MM-DD' })
  dataInicio?: string

  @ApiPropertyOptional({
    description: 'Data de fim para filtro por data de cadastro (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data fim deve ter o formato YYYY-MM-DD' })
  dataFim?: string

  @ApiPropertyOptional({
    description: 'Página da paginação (começando em 1)',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Página deve ser um número inteiro' })
  @Min(1, { message: 'Página deve ser maior que 0' })
  pagina?: number = 1

  @ApiPropertyOptional({
    description: 'Limite de registros por página (máximo 100)',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limite deve ser um número inteiro' })
  @Min(1, { message: 'Limite deve ser maior que 0' })
  @Max(100, { message: 'Limite não pode ser maior que 100' })
  limite?: number = 10
}
