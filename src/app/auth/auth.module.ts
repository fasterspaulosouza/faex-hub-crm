import { forwardRef, Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { MailModule } from 'src/common/external/mail/mail.module'
import { UsuariosModule } from '../usuarios/usuarios.module'
import { PrismaModule } from 'src/common/modules/prisma/prisma.module'
import { TokenModule } from 'src/common/modules/token/token.module'
import { MfaModule } from '../mfa/mfa.module'

@Module({
  imports: [
    MailModule,
    PrismaModule,
    TokenModule,
    forwardRef(() => UsuariosModule),
    MfaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
