import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { VisibilidadeConhecimento } from '@prisma/client'
import { BaseSearchDto } from 'src/common/dto/base-search.dto'

export class SearchConhecimentoDto extends BaseSearchDto {
  @ApiPropertyOptional({ enum: VisibilidadeConhecimento })
  @IsOptional()
  @IsEnum(VisibilidadeConhecimento)
  visibilidade?: VisibilidadeConhecimento

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  ativo?: boolean
}
