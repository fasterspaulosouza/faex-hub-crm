import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { VisibilidadeConhecimento } from '@prisma/client'

export class CreateConhecimentoDto {
  @ApiProperty({ description: 'Título da publicação de conhecimento', maxLength: 255 })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString({ message: 'Título deve ser uma string' })
  @MaxLength(255, { message: 'Título deve ter no máximo 255 caracteres' })
  titulo: string

  @ApiPropertyOptional({ description: 'Descrição do conteúdo' })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  descricao?: string

  @ApiProperty({ description: 'URL do vídeo no YouTube', maxLength: 500 })
  @IsNotEmpty({ message: 'URL do YouTube é obrigatória' })
  @IsString({ message: 'URL deve ser uma string' })
  @MaxLength(500, { message: 'URL deve ter no máximo 500 caracteres' })
  urlYoutube: string

  @ApiPropertyOptional({ enum: VisibilidadeConhecimento, default: VisibilidadeConhecimento.PRIVADO })
  @IsOptional()
  @IsEnum(VisibilidadeConhecimento, { message: 'Visibilidade deve ser PRIVADO ou PUBLICO' })
  visibilidade?: VisibilidadeConhecimento
}
