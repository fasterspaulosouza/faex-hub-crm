import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/common/modules/prisma/prisma.module'
import { TokenModule } from 'src/common/modules/token/token.module'
import { UsuariosModule } from '../usuarios/usuarios.module'
import { GruposAcessoController } from './grupos-acesso.controller'
import { GruposAcessoService } from './grupos-acesso.service'

@Module({
  imports: [PrismaModule, TokenModule, UsuariosModule],
  controllers: [GruposAcessoController],
  providers: [GruposAcessoService],
  exports: [GruposAcessoService],
})
export class GruposAcessoModule {}
