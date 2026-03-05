import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Visibilidade } from '@prisma/client'

export class UpdatePublicacaoDto {
  @ApiPropertyOptional({ description: 'Conteúdo textual da publicação' })
  @IsOptional()
  @IsString({ message: 'Conteúdo deve ser uma string' })
  conteudo?: string

  @ApiPropertyOptional({ description: 'URL da mídia', maxLength: 500 })
  @IsOptional()
  @IsString({ message: 'Mídia deve ser uma string' })
  @MaxLength(500)
  midia?: string

  @ApiPropertyOptional({ enum: Visibilidade })
  @IsOptional()
  @IsEnum(Visibilidade, { message: 'Visibilidade deve ser PUBLICO ou AMIGOS' })
  visibilidade?: Visibilidade
}
