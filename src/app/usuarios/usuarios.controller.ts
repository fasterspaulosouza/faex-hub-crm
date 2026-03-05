import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { NivelPermissao, UsuarioFuncao } from '@prisma/client'
import { UsuariosService } from './usuarios.service'
import { CreateUsuarioDto } from './dto/create-usuario.dto'
import { UpdateUsuarioDto } from './dto/update-usuario.dto'
import { SearchUsuarioDto } from './dto/search-usuario.dto'
import { Funcoes } from 'src/common/decorators/funcoes.decorator'
import { Permissao } from 'src/common/decorators/permissao.decorator'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { FuncaoGuard } from 'src/common/guards/funcao.guard'
import { PermissaoGuard } from 'src/common/guards/permissao.guard'
import { FiltrosUsuario } from './interfaces/usuario.interface'
import {
  AlterarSenhaSwagger,
  AtribuirPermissaoUsuarioSwagger,
  AtualizarUsuarioSwagger,
  BuscarComFiltrosSwagger,
  BuscarEstatisticasSwagger,
  BuscarPermissoesUsuarioSwagger,
  BuscarPorFuncaoSwagger,
  BuscarTodosUsuariosSwagger,
  BuscarUsuarioSwagger,
  CadastrarUsuarioInternoSwagger,
  RemoverPermissaoUsuarioSwagger,
  RemoverUsuarioSwagger,
} from './swagger/usuarios.swagger'

@ApiTags('usuarios')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissaoGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @BuscarTodosUsuariosSwagger()
  @Permissao('usuarios', NivelPermissao.LEITURA)
  buscarTodos(
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
  ) {
    const paginaNumber = pagina ? Math.max(1, parseInt(pagina, 10) || 1) : 1
    const limiteNumber = limite
      ? Math.min(100, Math.max(1, parseInt(limite, 10) || 10))
      : 10

    const filtros: FiltrosUsuario = {
      pagina: paginaNumber,
      limite: limiteNumber,
    }
    return this.usuariosService.buscarTodos(filtros)
  }

  @Get('buscar/avancado')
  @BuscarComFiltrosSwagger()
  @Permissao('usuarios', NivelPermissao.LEITURA)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  buscarComFiltros(@Query() searchDto: SearchUsuarioDto) {
    return this.usuariosService.buscarComFiltros(searchDto)
  }

  @Get('estatisticas/relatorio')
  @BuscarEstatisticasSwagger()
  @Permissao('usuarios', NivelPermissao.LEITURA)
  buscarEstatisticas() {
    return this.usuariosService.buscarEstatisticas()
  }

  @Get(':id')
  @BuscarUsuarioSwagger()
  @Permissao('usuarios', NivelPermissao.LEITURA)
  buscar(@Param('id') id: string) {
    return this.usuariosService.buscar(+id)
  }

  @Get(':funcao/byfuncao')
  @BuscarPorFuncaoSwagger()
  @Permissao('usuarios', NivelPermissao.LEITURA)
  buscarPorFuncao(@Param('funcao') funcao: UsuarioFuncao) {
    return this.usuariosService.buscarPorFuncao(funcao)
  }

  @Post()
  @CadastrarUsuarioInternoSwagger()
  @Permissao('usuarios', NivelPermissao.ESCRITA)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  cadastrarUsuarioInterno(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.cadastrarUsuarioInterno(createUsuarioDto)
  }

  @Patch(':id')
  @AtualizarUsuarioSwagger()
  @Permissao('usuarios', NivelPermissao.ESCRITA)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  atualizarUsuario(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.atualizarUsuario(+id, updateUsuarioDto)
  }

  @Patch(':id/alterar-senha')
  @AlterarSenhaSwagger()
  @Permissao('usuarios', NivelPermissao.ESCRITA)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  alterarSenha(
    @Param('id') id: string,
    @Body() alterarSenhaDto: { senhaAtual: string; novaSenha: string },
  ) {
    return this.usuariosService.alterarSenha(
      +id,
      alterarSenhaDto.senhaAtual,
      alterarSenhaDto.novaSenha,
    )
  }

  @Delete(':id')
  @RemoverUsuarioSwagger()
  @Permissao('usuarios', NivelPermissao.EXCLUSAO)
  @HttpCode(HttpStatus.OK)
  remover(@Param('id') id: string) {
    return this.usuariosService.remover(+id)
  }

  // ── Permissões individuais ───────────────────────────────────

  @Get(':id/permissoes')
  @BuscarPermissoesUsuarioSwagger()
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  buscarPermissoes(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.buscarPermissoes(id)
  }

  @Post(':id/permissoes')
  @AtribuirPermissaoUsuarioSwagger()
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  atribuirPermissao(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { moduloId: number; nivel: NivelPermissao },
  ) {
    return this.usuariosService.atribuirPermissao(id, dto)
  }

  @Delete(':id/permissoes/:moduloId')
  @RemoverPermissaoUsuarioSwagger()
  @UseGuards(AuthGuard, FuncaoGuard)
  @Funcoes(UsuarioFuncao.ADMIN)
  @HttpCode(HttpStatus.OK)
  removerPermissao(
    @Param('id', ParseIntPipe) id: number,
    @Param('moduloId', ParseIntPipe) moduloId: number,
  ) {
    return this.usuariosService.removerPermissao(id, moduloId)
  }
}
