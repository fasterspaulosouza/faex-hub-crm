import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FUNCOES_KEY } from 'src/common/decorators/funcoes.decorator'
import { UsuarioFuncao } from '@prisma/client'

@Injectable()
export class FuncaoGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const funcoesNecessarias = this.reflector.getAllAndOverride<
      UsuarioFuncao[]
    >(FUNCOES_KEY, [context.getHandler(), context.getClass()])

    if (!funcoesNecessarias) {
      return true
    }

    const { usuario } = context.switchToHttp().getRequest()
    const funcoesFiltradas = funcoesNecessarias.filter(
      (funcao) => funcao === usuario.funcao,
    )

    if (funcoesFiltradas.length > 0) {
      return true
    } else {
      return false
    }
  }
}
