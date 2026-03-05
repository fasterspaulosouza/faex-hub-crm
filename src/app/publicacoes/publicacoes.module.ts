import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/common/modules/prisma/prisma.module'
import { TokenModule } from 'src/common/modules/token/token.module'
import { UsuariosModule } from '../usuarios/usuarios.module'
import { PublicacoesController } from './publicacoes.controller'
import { PublicacoesService } from './publicacoes.service'

@Module({
  imports: [PrismaModule, TokenModule, UsuariosModule],
  controllers: [PublicacoesController],
  providers: [PublicacoesService],
  exports: [PublicacoesService],
})
export class PublicacoesModule {}
