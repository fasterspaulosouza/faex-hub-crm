import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { UsuariosModule } from './app/usuarios/usuarios.module'
import { AuthModule } from './app/auth/auth.module'
import { RemoteAddrMiddleware } from './common/middlewares/ip.middleware'
import { PrismaModule } from './common/modules/prisma/prisma.module'
import { TokenModule } from './common/modules/token/token.module'
import { MfaModule } from './app/mfa/mfa.module'
import { ModulosModule } from './app/modulos/modulos.module'
import { GruposAcessoModule } from './app/grupos-acesso/grupos-acesso.module'
import { AmizadesModule } from './app/amizades/amizades.module'
import { PublicacoesModule } from './app/publicacoes/publicacoes.module'
import { ConhecimentoModule } from './app/conhecimento/conhecimento.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    PrismaModule,
    TokenModule,
    AuthModule,
    MfaModule,
    UsuariosModule,
    ModulosModule,
    GruposAcessoModule,
    AmizadesModule,
    PublicacoesModule,
    ConhecimentoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RemoteAddrMiddleware).forRoutes('*')
  }
}
