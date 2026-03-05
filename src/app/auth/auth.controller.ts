import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AuthLoginDTO } from './dto/auth-login.dto'
import { AuthCadastroDTO } from './dto/auth-cadastro.dto'
import { AuthRedefinicaoDTO } from './dto/auth-redefinicao.dto'
import { AuthEsqueciSenhaDTO } from './dto/auth-esqueci-senha.dto'
import {
  AuthLoginResponseDTO,
  AuthCadastroResponseDTO,
  AuthEsqueciSenhaResponseDTO,
  AuthVerificarCodigoResponseDTO,
  MfaPendenteResponseDTO,
} from './dto/auth-response.dto'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { UsuariosService } from '../usuarios/usuarios.service'
import { CreateAuthVendasDto } from './dto/auth-register-vendas.dto'
import {
  LoginSwagger,
  CadastroSwagger,
  CadastroV2Swagger,
  EsqueciSenhaSwagger,
  VerificarCodigoSwagger,
  RedefinirSenhaSwagger,
} from './swagger/auth.swagger'
import { Usuario } from 'src/common/decorators/usuario.decorator'
import { UpdateUsuarioDto } from '../usuarios/dto/update-usuario.dto'

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuariosService: UsuariosService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginSwagger()
  async login(
    @Body(ValidationPipe) { email, senha }: AuthLoginDTO,
  ): Promise<AuthLoginResponseDTO | MfaPendenteResponseDTO> {
    return this.authService.login(email, senha)
  }

  @Post('cadastro')
  @HttpCode(HttpStatus.CREATED)
  @CadastroSwagger()
  async cadastro(
    @Body(ValidationPipe) body: AuthCadastroDTO,
  ): Promise<AuthCadastroResponseDTO> {
    return this.authService.cadastro(body)
  }

  @Post('cadastrov2')
  @HttpCode(HttpStatus.CREATED)
  @CadastroV2Swagger()
  async cadastrov2(@Body(ValidationPipe) body: CreateAuthVendasDto) {
    return this.authService.cadastrov2(body)
  }

  @Post('esqueci-senha')
  @HttpCode(HttpStatus.OK)
  @EsqueciSenhaSwagger()
  async esqueciSenha(
    @Body(ValidationPipe) { email }: AuthEsqueciSenhaDTO,
  ): Promise<AuthEsqueciSenhaResponseDTO> {
    await this.authService.esqueciSenha(email)
    return {
      mensagem: 'E-mail de recuperação enviado!',
      sucesso: true,
    }
  }

  @Get('esqueci-senha/:codigo')
  @HttpCode(HttpStatus.OK)
  @VerificarCodigoSwagger()
  async esqueciSenhaCodigo(
    @Param('codigo') codigo: string,
  ): Promise<AuthVerificarCodigoResponseDTO> {
    const token = await this.authService.verificarCodigo(codigo)
    return { token }
  }

  @Post('redefinir-senha')
  @HttpCode(HttpStatus.OK)
  @RedefinirSenhaSwagger()
  async redefinirSenha(@Body() { senha, token }: AuthRedefinicaoDTO) {
    await this.authService.redefinirSenha(senha, token)
    return { mensagem: 'Senha redefinida com sucesso!' }
  }

  @Put('perfil')
  @UseGuards(AuthGuard)
  async atualizarPerfil(
    @Usuario() usuario,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.atualizarUsuario(
      Number(usuario.id),
      updateUsuarioDto,
    )
  }

  @Put('senha')
  @UseGuards(AuthGuard)
  async alterarSenha(
    @Body('senhaAtual') senhaAtual: string,
    @Body('novaSenha') novaSenha: string,
    @Usuario() usuario,
  ) {
    return this.usuariosService.alterarSenha(
      Number(usuario.id),
      senhaAtual,
      novaSenha,
    )
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Usuario() usuario) {
    return { usuario }
  }
}
