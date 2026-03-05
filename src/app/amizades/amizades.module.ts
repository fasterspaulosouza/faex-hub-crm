import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/common/modules/prisma/prisma.module'
import { TokenModule } from 'src/common/modules/token/token.module'
import { UsuariosModule } from '../usuarios/usuarios.module'
import { AmizadesController } from './amizades.controller'
import { AmizadesService } from './amizades.service'

@Module({
  imports: [PrismaModule, TokenModule, UsuariosModule],
  controllers: [AmizadesController],
  providers: [AmizadesService],
  exports: [AmizadesService],
})
export class AmizadesModule {}
