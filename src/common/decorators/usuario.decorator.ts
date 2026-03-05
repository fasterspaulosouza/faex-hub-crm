import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

export const Usuario = createParamDecorator(
  (filter: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    if (request.usuario) {
      if (filter) {
        return request.usuario[filter]
      } else {
        return request.usuario
      }
    } else {
      throw new NotFoundException(
        'Usuário não encontrado no Request. Use o AuthGuard para obter o usuário',
      )
    }
  },
)
