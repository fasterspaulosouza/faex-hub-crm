import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { MfaService } from './mfa.service'
import { MfaAtivarDto } from './dto/mfa-ativar.dto'
import { MfaVerificarDto } from './dto/mfa-verificar.dto'
import { MfaDesativarDto } from './dto/mfa-desativar.dto'
import { MfaBackupVerificarDto } from './dto/mfa-backup-verificar.dto'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { Usuario } from 'src/common/decorators/usuario.decorator'
import {
  ConfigurarMfaSwagger,
  AtivarMfaSwagger,
  DesativarMfaSwagger,
  VerificarMfaSwagger,
  VerificarBackupSwagger,
  StatusMfaSwagger,
  RegenerarBackupSwagger,
} from './swagger/mfa.swagger'

@ApiTags('MFA - Autenticação Multi-Fator')
@Controller('mfa')
export class MfaController {
  constructor(private readonly mfaService: MfaService) {}

  @Post('configurar')
  @UseGuards(AuthGuard)
  @ConfigurarMfaSwagger()
  async configurar(@Usuario() usuario) {
    return this.mfaService.gerarConfiguracao(Number(usuario.id))
  }

  @Post('ativar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @AtivarMfaSwagger()
  async ativar(@Usuario() usuario, @Body() dto: MfaAtivarDto) {
    return this.mfaService.ativar(Number(usuario.id), dto.codigo)
  }

  @Delete('desativar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @DesativarMfaSwagger()
  async desativar(@Usuario() usuario, @Body() dto: MfaDesativarDto) {
    return this.mfaService.desativar(Number(usuario.id), dto.senha)
  }

  @Get('status')
  @UseGuards(AuthGuard)
  @StatusMfaSwagger()
  async status(@Usuario() usuario) {
    return this.mfaService.verificarStatus(Number(usuario.id))
  }

  @Post('backup/regenerar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @RegenerarBackupSwagger()
  async regenerarBackup(@Usuario() usuario) {
    return this.mfaService.regenerarCodigosBackup(Number(usuario.id))
  }

  @Post('verificar')
  @HttpCode(HttpStatus.OK)
  @VerificarMfaSwagger()
  async verificar(@Body() dto: MfaVerificarDto) {
    return this.mfaService.verificarCodigoLogin(dto.token, dto.codigo)
  }

  @Post('verificar-backup')
  @HttpCode(HttpStatus.OK)
  @VerificarBackupSwagger()
  async verificarBackup(@Body() dto: MfaBackupVerificarDto) {
    return this.mfaService.verificarCodigoBackup(dto.token, dto.codigoBackup)
  }
}
