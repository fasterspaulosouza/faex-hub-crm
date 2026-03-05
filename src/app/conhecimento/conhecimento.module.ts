import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/common/modules/prisma/prisma.module'
import { TokenModule } from 'src/common/modules/token/token.module'
import { UsuariosModule } from '../usuarios/usuarios.module'
import { ConhecimentoController } from './conhecimento.controller'
import { ConhecimentoService } from './conhecimento.service'

@Module({
  imports: [PrismaModule, TokenModule, UsuariosModule],
  controllers: [ConhecimentoController],
  providers: [ConhecimentoService],
  exports: [ConhecimentoService],
})
export class ConhecimentoModule {}
