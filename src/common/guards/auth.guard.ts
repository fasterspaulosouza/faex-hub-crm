import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { IssuerJWT } from '../enums/jwt.enum'
import { UsuariosService } from 'src/app/usuarios/usuarios.service'
import { TokenService } from '../modules/token/token.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const { authorization } = request.headers

    try {
      const data = this.tokenService.checkToken(
        (authorization ?? '').split(' ')[1],
        IssuerJWT.LOGIN,
      )
      request.tokenPayload = data
      request.usuario = await this.usuariosService.buscar(+data.id)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
