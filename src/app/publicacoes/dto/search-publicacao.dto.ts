import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PublicacaoTipo, Visibilidade } from '@prisma/client'
import { BaseSearchDto } from 'src/common/dto/base-search.dto'

export class SearchPublicacaoDto extends BaseSearchDto {
  @ApiPropertyOptional({ enum: PublicacaoTipo })
  @IsOptional()
  @IsEnum(PublicacaoTipo)
  tipo?: PublicacaoTipo

  @ApiPropertyOptional({ enum: Visibilidade })
  @IsOptional()
  @IsEnum(Visibilidade)
  visibilidade?: Visibilidade

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  ativo?: boolean
}
