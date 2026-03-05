import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PublicacaoTipo, Visibilidade } from '@prisma/client'

export class CreatePublicacaoDto {
  @ApiProperty({ enum: PublicacaoTipo, description: 'Tipo da publicação' })
  @IsEnum(PublicacaoTipo, { message: 'Tipo deve ser TEXTO, IMAGEM ou VIDEO' })
  tipo: PublicacaoTipo

  @ApiPropertyOptional({ description: 'Conteúdo textual da publicação' })
  @IsOptional()
  @IsString({ message: 'Conteúdo deve ser uma string' })
  conteudo?: string

  @ApiPropertyOptional({ description: 'URL da mídia (imagem ou vídeo)', maxLength: 500 })
  @IsOptional()
  @IsString({ message: 'Mídia deve ser uma string' })
  @MaxLength(500, { message: 'URL da mídia deve ter no máximo 500 caracteres' })
  midia?: string

  @ApiPropertyOptional({ enum: Visibilidade, default: Visibilidade.AMIGOS })
  @IsOptional()
  @IsEnum(Visibilidade, { message: 'Visibilidade deve ser PUBLICO ou AMIGOS' })
  visibilidade?: Visibilidade
}
