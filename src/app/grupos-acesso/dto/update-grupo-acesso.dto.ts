import { PartialType } from '@nestjs/mapped-types'
import { CreateGrupoAcessoDto } from './create-grupo-acesso.dto'

export class UpdateGrupoAcessoDto extends PartialType(CreateGrupoAcessoDto) {}
