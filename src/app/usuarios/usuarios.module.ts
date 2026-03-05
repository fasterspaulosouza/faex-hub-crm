import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { UsuariosService } from './usuarios.service'
import { UsuariosController } from './usuarios.controller'
import { UserIdCheckMiddleware } from 'src/common/middlewares/user-id-check.middleware'
import { PrismaModule } from 'src/common/modules/prisma/prisma.module'
import { TokenModule } from 'src/common/modules/token/token.module'
import { AuthModule } from '../auth/auth.module'
import { MailModule } from 'src/common/external/mail/mail.module'

@Module({
  imports: [
    MailModule,
    PrismaModule,
    TokenModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: 'usuarios/:id',
      method: RequestMethod.ALL,
    })
  }
}
