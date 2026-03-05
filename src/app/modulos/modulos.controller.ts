import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { UsuarioFuncao } from '@prisma/client'
import { Funcoes } from 'src/common/decorators/funcoes.decorator'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { FuncaoGuard } from 'src/common/guards/funcao.guard'
import { CreateModuloDto } from './dto/create-modulo.dto'
import { UpdateModuloDto } from './dto/update-modulo.dto'
import { SearchModuloDto } from './dto/search-modulo.dto'
import { ModulosService } from './modulos.service'
import {
  AtualizarModuloSwagger,
  BuscarModuloSwagger,
  BuscarModulosSwagger,
  CriarModuloSwagger,
  RemoverModuloSwagger,
} from './swagger/modulos.swagger'

@Controller('modulos')
export class ModulosController {
  constructor(private readonly modulosService: ModulosService) {}

  @Get()
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  @BuscarModulosSwagger()
  buscarComFiltros(@Query() searchDto: SearchModuloDto) {
    return this.modulosService.buscarComFiltros(searchDto)
  }

  @Get(':id')
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  @BuscarModuloSwagger()
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.modulosService.buscar(id)
  }

  @Post()
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @CriarModuloSwagger()
  criar(@Body() dto: CreateModuloDto) {
    return this.modulosService.criar(dto)
  }

  @Patch(':id')
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  @AtualizarModuloSwagger()
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateModuloDto) {
    return this.modulosService.atualizar(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  @RemoverModuloSwagger()
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.modulosService.remover(id)
  }
}
