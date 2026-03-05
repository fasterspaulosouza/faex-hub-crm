import { IsBoolean, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { BaseSearchDto } from 'src/common/dto/base-search.dto'

export class SearchModuloDto extends BaseSearchDto {
  @IsOptional()
  @IsBoolean({ message: 'Ativo deve ser um booleano' })
  @Transform(({ value }) => value === 'true' || value === true)
  ativo?: boolean
}
