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
import { ConhecimentoService } from './conhecimento.service'
import { CreateConhecimentoDto } from './dto/create-conhecimento.dto'
import { SearchConhecimentoDto } from './dto/search-conhecimento.dto'
import { UpdateConhecimentoDto } from './dto/update-conhecimento.dto'
import {
  AtualizarConhecimentoSwagger,
  BuscarConhecimentoSwagger,
  BuscarConhecimentosSwagger,
  BuscarMeusConhecimentosSwagger,
  CriarConhecimentoSwagger,
  RemoverConhecimentoSwagger,
} from './swagger/conhecimento.swagger'

@ApiTags('conhecimento')
@UseGuards(AuthGuard)
@Controller('conhecimento')
export class ConhecimentoController {
  constructor(private readonly conhecimentoService: ConhecimentoService) {}

  @Get()
  @BuscarConhecimentosSwagger()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  buscarComFiltros(@Query() searchDto: SearchConhecimentoDto) {
    return this.conhecimentoService.buscarComFiltros(searchDto)
  }

  @Get('meus')
  @BuscarMeusConhecimentosSwagger()
  @HttpCode(HttpStatus.OK)
  buscarMeus(
    @Usuario('id') usuarioId: number,
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
  ) {
    const paginaNum = pagina ? Math.max(1, parseInt(pagina, 10) || 1) : 1
    const limiteNum = limite ? Math.min(100, Math.max(1, parseInt(limite, 10) || 10)) : 10
    return this.conhecimentoService.buscarMeus(usuarioId, paginaNum, limiteNum)
  }

  @Get(':id')
  @BuscarConhecimentoSwagger()
  @HttpCode(HttpStatus.OK)
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.conhecimentoService.buscar(id)
  }

  @Post()
  @CriarConhecimentoSwagger()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  criar(@Usuario('id') usuarioId: number, @Body() dto: CreateConhecimentoDto) {
    return this.conhecimentoService.criar(usuarioId, dto)
  }

  @Patch(':id')
  @AtualizarConhecimentoSwagger()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Usuario('id') usuarioId: number,
    @Body() dto: UpdateConhecimentoDto,
  ) {
    return this.conhecimentoService.atualizar(id, usuarioId, dto)
  }

  @Delete(':id')
  @RemoverConhecimentoSwagger()
  @HttpCode(HttpStatus.OK)
  remover(@Param('id', ParseIntPipe) id: number, @Usuario('id') usuarioId: number) {
    return this.conhecimentoService.remover(id, usuarioId)
  }
}
