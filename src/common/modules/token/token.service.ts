import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Usuario } from '@prisma/client'
import { AudienceJWT, IssuerJWT } from 'src/common/enums/jwt.enum'

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  // Cria um token JWT contendo dados básicos do usuário
  createToken(usuario: Usuario) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          foto: usuario.foto,
          funcao: usuario.funcao,
          ativo: usuario.ativo,
        },
        {
          subject: String(usuario.id),
          issuer: IssuerJWT.LOGIN,
          audience: AudienceJWT.FAEXHUB,
          expiresIn: '1 day', // Token válido por 1 dia
        },
      ),
    }
  }

  // Cria um token JWT para recuperação de senha
  forgetToken(usuario: Usuario): string {
    return this.jwtService.sign(
      { id: usuario.id },
      {
        subject: String(usuario.id),
        issuer: IssuerJWT.FORGET,
        audience: AudienceJWT.FAEXHUB,
        expiresIn: '30 minutes',
      },
    )
  }

  // Cria um token JWT temporário para verificação MFA (5 minutos)
  mfaPendenteToken(usuario: Usuario): string {
    return this.jwtService.sign(
      { id: usuario.id, mfaPendente: true },
      {
        subject: String(usuario.id),
        issuer: IssuerJWT.MFA_PENDENTE,
        audience: AudienceJWT.FAEXHUB,
        expiresIn: '5 minutes',
      },
    )
  }

  // Valida um token JWT e retorna seus dados decodificados
  checkToken(token: string, issuer?: IssuerJWT) {
    try {
      return this.jwtService.verify(token, {
        issuer,
        audience: AudienceJWT.FAEXHUB,
      })
    } catch (error) {
      // Lança exceção se o token for inválido ou expirado
      throw new BadRequestException(error)
    }
  }

  isValidToken(token: string, issuer?: IssuerJWT): boolean {
    try {
      this.checkToken(token, issuer)
      return true
    } catch {
      return false
    }
  }
}
