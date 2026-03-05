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
import { AdicionarMembroDto } from './dto/adicionar-membro.dto'
import { AtribuirPermissaoDto } from './dto/atribuir-permissao.dto'
import { CreateGrupoAcessoDto } from './dto/create-grupo-acesso.dto'
import { SearchGrupoAcessoDto } from './dto/search-grupo-acesso.dto'
import { UpdateGrupoAcessoDto } from './dto/update-grupo-acesso.dto'
import { GruposAcessoService } from './grupos-acesso.service'
import {
  AdicionarMembroSwagger,
  AtribuirPermissaoGrupoSwagger,
  AtualizarGrupoAcessoSwagger,
  BuscarGrupoAcessoSwagger,
  BuscarGruposAcessoSwagger,
  BuscarMembrosSwagger,
  BuscarPermissoesGrupoSwagger,
  CriarGrupoAcessoSwagger,
  RemoverGrupoAcessoSwagger,
  RemoverMembroSwagger,
  RemoverPermissaoGrupoSwagger,
} from './swagger/grupos-acesso.swagger'

@Controller('grupos-acesso')
export class GruposAcessoController {
  constructor(private readonly gruposAcessoService: GruposAcessoService) {}

  @Get()
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  @BuscarGruposAcessoSwagger()
  buscarComFiltros(@Query() searchDto: SearchGrupoAcessoDto) {
    return this.gruposAcessoService.buscarComFiltros(searchDto)
  }

  @Get(':id')
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  @BuscarGrupoAcessoSwagger()
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.gruposAcessoService.buscar(id)
  }

  @Post()
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @CriarGrupoAcessoSwagger()
  criar(@Body() dto: CreateGrupoAcessoDto) {
    return this.gruposAcessoService.criar(dto)
  }

  @Patch(':id')
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  @AtualizarGrupoAcessoSwagger()
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGrupoAcessoDto) {
    return this.gruposAcessoService.atualizar(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  @RemoverGrupoAcessoSwagger()
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.gruposAcessoService.remover(id)
  }

  // ── Membros ─────────────────────────────────────────────────

  @Get(':id/membros')
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  @BuscarMembrosSwagger()
  buscarMembros(@Param('id', ParseIntPipe) id: number) {
    return this.gruposAcessoService.buscarMembros(id)
  }

  @Post(':id/membros')
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @AdicionarMembroSwagger()
  adicionarMembro(@Param('id', ParseIntPipe) id: number, @Body() dto: AdicionarMembroDto) {
    return this.gruposAcessoService.adicionarMembro(id, dto)
  }

  @Delete(':id/membros/:usuarioId')
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  @RemoverMembroSwagger()
  removerMembro(
    @Param('id', ParseIntPipe) id: number,
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    return this.gruposAcessoService.removerMembro(id, usuarioId)
  }

  // ── Permissões ───────────────────────────────────────────────

  @Get(':id/permissoes')
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  @BuscarPermissoesGrupoSwagger()
  buscarPermissoes(@Param('id', ParseIntPipe) id: number) {
    return this.gruposAcessoService.buscarPermissoes(id)
  }

  @Post(':id/permissoes')
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  @AtribuirPermissaoGrupoSwagger()
  atribuirPermissao(@Param('id', ParseIntPipe) id: number, @Body() dto: AtribuirPermissaoDto) {
    return this.gruposAcessoService.atribuirPermissao(id, dto)
  }

  @Delete(':id/permissoes/:moduloId')
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  @RemoverPermissaoGrupoSwagger()
  removerPermissao(
    @Param('id', ParseIntPipe) id: number,
    @Param('moduloId', ParseIntPipe) moduloId: number,
  ) {
    return this.gruposAcessoService.removerPermissao(id, moduloId)
  }
}
