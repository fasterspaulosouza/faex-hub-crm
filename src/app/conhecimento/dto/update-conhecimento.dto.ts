import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { VisibilidadeConhecimento } from '@prisma/client'

export class UpdateConhecimentoDto {
  @ApiPropertyOptional({ description: 'Título da publicação', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titulo?: string

  @ApiPropertyOptional({ description: 'Descrição do conteúdo' })
  @IsOptional()
  @IsString()
  descricao?: string

  @ApiPropertyOptional({ description: 'URL do vídeo no YouTube', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  urlYoutube?: string

  @ApiPropertyOptional({ enum: VisibilidadeConhecimento })
  @IsOptional()
  @IsEnum(VisibilidadeConhecimento, { message: 'Visibilidade deve ser PRIVADO ou PUBLICO' })
  visibilidade?: VisibilidadeConhecimento
}
