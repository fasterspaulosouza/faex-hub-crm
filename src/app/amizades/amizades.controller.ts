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
import { AmizadesService } from './amizades.service'
import { EnviarSolicitacaoDto } from './dto/enviar-solicitacao.dto'
import {
  AceitarSolicitacaoSwagger,
  BuscarAmizadesSwagger,
  BuscarEnviadasSwagger,
  BuscarPendentesSwagger,
  EnviarSolicitacaoSwagger,
  RejeitarSolicitacaoSwagger,
  RemoverAmizadeSwagger,
} from './swagger/amizades.swagger'

@ApiTags('amizades')
@UseGuards(AuthGuard)
@Controller('amizades')
export class AmizadesController {
  constructor(private readonly amizadesService: AmizadesService) {}

  @Get()
  @BuscarAmizadesSwagger()
  @HttpCode(HttpStatus.OK)
  buscarAmizades(
    @Usuario('id') usuarioId: number,
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
  ) {
    const paginaNum = pagina ? Math.max(1, parseInt(pagina, 10) || 1) : 1
    const limiteNum = limite ? Math.min(100, Math.max(1, parseInt(limite, 10) || 10)) : 10
    return this.amizadesService.buscarAmizades(usuarioId, paginaNum, limiteNum)
  }

  @Get('pendentes')
  @BuscarPendentesSwagger()
  @HttpCode(HttpStatus.OK)
  buscarPendentes(@Usuario('id') usuarioId: number) {
    return this.amizadesService.buscarPendentes(usuarioId)
  }

  @Get('enviadas')
  @BuscarEnviadasSwagger()
  @HttpCode(HttpStatus.OK)
  buscarEnviadas(@Usuario('id') usuarioId: number) {
    return this.amizadesService.buscarEnviadas(usuarioId)
  }

  @Post()
  @EnviarSolicitacaoSwagger()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  enviarSolicitacao(
    @Usuario('id') usuarioId: number,
    @Body() dto: EnviarSolicitacaoDto,
  ) {
    return this.amizadesService.enviarSolicitacao(usuarioId, dto)
  }

  @Patch(':id/aceitar')
  @AceitarSolicitacaoSwagger()
  @HttpCode(HttpStatus.OK)
  aceitarSolicitacao(
    @Param('id', ParseIntPipe) id: number,
    @Usuario('id') usuarioId: number,
  ) {
    return this.amizadesService.aceitarSolicitacao(id, usuarioId)
  }

  @Patch(':id/rejeitar')
  @RejeitarSolicitacaoSwagger()
  @HttpCode(HttpStatus.OK)
  rejeitarSolicitacao(
    @Param('id', ParseIntPipe) id: number,
    @Usuario('id') usuarioId: number,
  ) {
    return this.amizadesService.rejeitarSolicitacao(id, usuarioId)
  }

  @Delete(':id')
  @RemoverAmizadeSwagger()
  @HttpCode(HttpStatus.OK)
  remover(
    @Param('id', ParseIntPipe) id: number,
    @Usuario('id') usuarioId: number,
  ) {
    return this.amizadesService.remover(id, usuarioId)
  }
}
