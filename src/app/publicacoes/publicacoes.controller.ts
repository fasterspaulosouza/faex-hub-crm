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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Usuario } from 'src/common/decorators/usuario.decorator'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { CreateComentarioDto } from './dto/create-comentario.dto'
import { CreatePublicacaoDto } from './dto/create-publicacao.dto'
import { SearchPublicacaoDto } from './dto/search-publicacao.dto'
import { UpdatePublicacaoDto } from './dto/update-publicacao.dto'
import { PublicacoesService } from './publicacoes.service'
import {
  AdicionarComentarioSwagger,
  AtualizarPublicacaoSwagger,
  BuscarComentariosSwagger,
  BuscarCurtidasSwagger,
  BuscarMinhasPublicacoesSwagger,
  BuscarPublicacaoSwagger,
  BuscarPublicacoesSwagger,
  CriarPublicacaoSwagger,
  RemoverComentarioSwagger,
  RemoverPublicacaoSwagger,
  ToggleCurtidaSwagger,
} from './swagger/publicacoes.swagger'

@ApiTags('publicacoes')
@UseGuards(AuthGuard)
@Controller('publicacoes')
export class PublicacoesController {
  constructor(private readonly publicacoesService: PublicacoesService) {}

  @Get()
  @BuscarPublicacoesSwagger()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  buscarComFiltros(@Query() searchDto: SearchPublicacaoDto) {
    return this.publicacoesService.buscarComFiltros(searchDto)
  }

  @Get('minhas')
  @BuscarMinhasPublicacoesSwagger()
  @HttpCode(HttpStatus.OK)
  buscarMinhas(
    @Usuario('id') usuarioId: number,
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
  ) {
    const paginaNum = pagina ? Math.max(1, parseInt(pagina, 10) || 1) : 1
    const limiteNum = limite ? Math.min(100, Math.max(1, parseInt(limite, 10) || 10)) : 10
    return this.publicacoesService.buscarMinhas(usuarioId, paginaNum, limiteNum)
  }

  @Get(':id')
  @BuscarPublicacaoSwagger()
  @HttpCode(HttpStatus.OK)
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.publicacoesService.buscar(id)
  }

  @Post()
  @CriarPublicacaoSwagger()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  criar(@Usuario('id') usuarioId: number, @Body() dto: CreatePublicacaoDto) {
    return this.publicacoesService.criar(usuarioId, dto)
  }

  @Patch(':id')
  @AtualizarPublicacaoSwagger()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Usuario('id') usuarioId: number,
    @Body() dto: UpdatePublicacaoDto,
  ) {
    return this.publicacoesService.atualizar(id, usuarioId, dto)
  }

  @Delete(':id')
  @RemoverPublicacaoSwagger()
  @HttpCode(HttpStatus.OK)
  remover(@Param('id', ParseIntPipe) id: number, @Usuario('id') usuarioId: number) {
    return this.publicacoesService.remover(id, usuarioId)
  }

  // ── Comentários ──────────────────────────────────────────────

  @Get(':id/comentarios')
  @BuscarComentariosSwagger()
  @HttpCode(HttpStatus.OK)
  buscarComentarios(@Param('id', ParseIntPipe) id: number) {
    return this.publicacoesService.buscarComentarios(id)
  }

  @Post(':id/comentarios')
  @AdicionarComentarioSwagger()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  adicionarComentario(
    @Param('id', ParseIntPipe) id: number,
    @Usuario('id') usuarioId: number,
    @Body() dto: CreateComentarioDto,
  ) {
    return this.publicacoesService.adicionarComentario(id, usuarioId, dto)
  }

  @Delete(':id/comentarios/:comentarioId')
  @RemoverComentarioSwagger()
  @HttpCode(HttpStatus.OK)
  removerComentario(
    @Param('id', ParseIntPipe) id: number,
    @Param('comentarioId', ParseIntPipe) comentarioId: number,
    @Usuario('id') usuarioId: number,
  ) {
    return this.publicacoesService.removerComentario(id, comentarioId, usuarioId)
  }

  // ── Curtidas ─────────────────────────────────────────────────

  @Get(':id/curtidas')
  @BuscarCurtidasSwagger()
  @HttpCode(HttpStatus.OK)
  buscarCurtidas(@Param('id', ParseIntPipe) id: number) {
    return this.publicacoesService.buscarCurtidas(id)
  }

  @Post(':id/curtidas')
  @ToggleCurtidaSwagger()
  @HttpCode(HttpStatus.OK)
  toggleCurtida(@Param('id', ParseIntPipe) id: number, @Usuario('id') usuarioId: number) {
    return this.publicacoesService.toggleCurtida(id, usuarioId)
  }
}
