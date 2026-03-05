import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/common/modules/prisma/prisma.service'
import { AuthCadastroDTO } from './dto/auth-cadastro.dto'
import {
  AuthLoginResponseDTO,
  AuthCadastroResponseDTO,
  MfaPendenteResponseDTO,
} from './dto/auth-response.dto'
import * as bcrypt from 'bcrypt'
import { MailService } from 'src/common/external/mail/mail.service'
import { UsuariosService } from '../usuarios/usuarios.service'
import { AudienceJWT } from 'src/common/enums/jwt.enum'
import { TokenService } from 'src/common/modules/token/token.service'
import { CreateAuthVendasDto } from './dto/auth-register-vendas.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly usuariosService: UsuariosService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ) {}

  async cadastro(data: AuthCadastroDTO): Promise<AuthCadastroResponseDTO> {
    try {
      const resultado = await this.usuariosService.criarUsuarioExterno(data)
      return {
        mensagem: 'Usuário cadastrado com sucesso!',
        accessToken: resultado.accessToken,
      }
    } catch (error) {
      throw new BadRequestException(
        'Erro ao cadastrar usuário: ' + error.message,
      )
    }
  }

  // Função provisória
  async cadastrov2(data: CreateAuthVendasDto) {
    return this.usuariosService.criarUsuarioExternoV2(data)
  }

  async login(
    email: string,
    senha: string,
  ): Promise<AuthLoginResponseDTO | MfaPendenteResponseDTO> {
    const usuario = await this.prismaService.usuario.findFirst({
      where: { email },
    })

    if (!usuario) {
      throw new UnauthorizedException('Email e/ou senha incorretos!')
    }

    if (!(await bcrypt.compare(senha, usuario.senha))) {
      throw new UnauthorizedException('Email e/ou senha incorretos!')
    }

    // Verificar se o usuário tem MFA ativo
    const mfa = await this.prismaService.usuarioMfa.findUnique({
      where: { usuarioId: usuario.id },
      select: { ativo: true },
    })
    const temMfa = !!mfa?.ativo

    if (temMfa) {
      const mfaPendenteToken = this.tokenService.mfaPendenteToken(usuario)
      return {
        mfaRequerido: true,
        mfaPendenteToken,
        mensagem: 'Verificação MFA necessária. Envie o código TOTP.',
      }
    }

    const tokenResult = this.tokenService.createToken(usuario)

    return {
      accessToken: tokenResult.accessToken,
      tokenType: 'Bearer',
      expiresIn: 86400, // 24 horas em segundos
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    }
  }

  async esqueciSenha(email: string): Promise<boolean> {
    const usuario = await this.prismaService.usuario.findFirst({
      where: { email },
    })

    if (!usuario) {
      throw new NotFoundException('Email não encontrado!')
    }

    const token = this.jwtService.sign(
      { id: usuario.id },
      {
        expiresIn: '30 minutes',
        subject: String(usuario.id),
        issuer: 'forget',
        audience: AudienceJWT.FAEXHUB,
      },
    )

    const codigo = String(Math.floor(100000 + Math.random() * 900000))

    await this.prismaService.usuarioRecuperacao.create({
      data: {
        usuarioId: usuario.id,
        token,
        codigo,
      },
    })

    await this.mailService.send({
      to: email,
      subject: 'Esqueci a senha',
      template: 'password/forgot',
      data: {
        nome: usuario.nome,
        codigo,
      },
    })

    return true
  }

  async verificarCodigo(codigo: string): Promise<string> {
    try {
      const recovery = await this.prismaService.usuarioRecuperacao.findUnique({
        where: {
          codigo,
          resetAt: null, // Apenas códigos não utilizados
        },
      })

      if (!recovery) {
        throw new UnauthorizedException(
          'Código informado está incorreto ou já foi utilizado.',
        )
      }

      return recovery.token
    } catch (e) {
      console.error('Erro ao verificar código:', e)
      throw new UnauthorizedException('Código informado está incorreto.')
    }
  }

  async redefinirSenha(
    senha: string,
    token: string,
  ): Promise<AuthLoginResponseDTO> {
    try {
      const data: any = this.jwtService.verify(token, {
        issuer: 'forget',
        audience: AudienceJWT.FAEXHUB,
      })

      if (isNaN(Number(data.id))) {
        throw new BadRequestException('Token é inválido.')
      }

      const usuarioRecuperacao =
        await this.prismaService.usuarioRecuperacao.findFirst({
          where: {
            token,
            resetAt: null,
          },
        })

      if (!usuarioRecuperacao) {
        throw new BadRequestException('Token já foi utilizado.')
      }

      // Marcar token como utilizado
      await this.prismaService.usuarioRecuperacao.update({
        where: {
          id: usuarioRecuperacao.id,
        },
        data: {
          resetAt: new Date(),
        },
      })

      // Atualizar senha
      const salto = await bcrypt.genSalt()
      const senhaHash = await bcrypt.hash(senha, salto)

      const usuario = await this.prismaService.usuario.update({
        where: { id: +data.id },
        data: { senha: senhaHash },
      })

      // Enviar confirmação por email
      await this.mailService.send({
        to: usuario.email,
        subject: 'Senha alterada com sucesso!',
        template: 'password/reset-password-confirm',
        data: {
          nome: usuario.nome,
        },
      })

      // Retornar token de login
      const tokenResult = this.tokenService.createToken(usuario)

      return {
        accessToken: tokenResult.accessToken,
        tokenType: 'Bearer',
        expiresIn: 86400,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
        },
      }
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error
      }
      throw new BadRequestException(
        'Erro ao redefinir senha. Verifique se o token está válido.',
      )
    }
  }
}
