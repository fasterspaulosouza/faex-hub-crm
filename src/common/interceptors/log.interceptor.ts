import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const data = Date.now()
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest()
        console.log(
          `Execução via ${request.method} -> URL: ${request.url}, levou ${Date.now() - data} milisegundos.`,
        )
      }),
    )
  }
}
