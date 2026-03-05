import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { throwError } from 'rxjs'

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { method, url, body, usuario } = request
    const startTime = Date.now()

    // Log da requisição
    this.logger.log(
      `[${method}] ${url} - Usuario: ${usuario?.nome || 'Anonimo'} - Inicio: ${new Date().toISOString()}`,
    )

    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now()
        const duration = endTime - startTime

        this.logger.log(
          `[${method}] ${url} - Sucesso - Tempo: ${duration}ms - Usuario: ${usuario?.nome || 'Anonimo'}`,
        )
      }),
      catchError((error) => {
        const endTime = Date.now()
        const duration = endTime - startTime

        this.logger.error(
          `[${method}] ${url} - Erro: ${error.message} - Tempo: ${duration}ms - Usuario: ${usuario?.nome || 'Anonimo'}`,
        )

        return throwError(() => error)
      }),
    )
  }
}
