import { Module, forwardRef } from '@nestjs/common'
import { MfaController } from './mfa.controller'
import { MfaService } from './mfa.service'
import { PrismaModule } from 'src/common/modules/prisma/prisma.module'
import { TokenModule } from 'src/common/modules/token/token.module'
import { UsuariosModule } from '../usuarios/usuarios.module'

@Module({
  imports: [PrismaModule, TokenModule, forwardRef(() => UsuariosModule)],
  controllers: [MfaController],
  providers: [MfaService],
  exports: [MfaService],
})
export class MfaModule {}
