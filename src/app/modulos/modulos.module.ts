import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/common/modules/prisma/prisma.module'
import { TokenModule } from 'src/common/modules/token/token.module'
import { UsuariosModule } from '../usuarios/usuarios.module'
import { ModulosController } from './modulos.controller'
import { ModulosService } from './modulos.service'

@Module({
  imports: [PrismaModule, TokenModule, UsuariosModule],
  controllers: [ModulosController],
  providers: [ModulosService],
  exports: [ModulosService],
})
export class ModulosModule {}
