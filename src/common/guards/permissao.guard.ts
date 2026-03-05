import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { NivelPermissao, UsuarioFuncao } from '@prisma/client'
import { PrismaService } from '../modules/prisma/prisma.service'
import { PERMISSAO_KEY } from '../decorators/permissao.decorator'

interface MetadadosPermissao {
  modulo: string
  nivel: NivelPermissao
}

@Injectable()
export class PermissaoGuard implements CanActivate {
  private readonly hierarquia: Record<NivelPermissao, number> = {
    [NivelPermissao.NENHUM]: 0,
    [NivelPermissao.LEITURA]: 1,
    [NivelPermissao.ESCRITA]: 2,
    [NivelPermissao.EXCLUSAO]: 3,
  }

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadados = this.reflector.getAllAndOverride<MetadadosPermissao>(PERMISSAO_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!metadados) return true

    const request = context.switchToHttp().getRequest()
    const usuario = request.usuario

    if (!usuario) return false

    if (usuario.funcao === UsuarioFuncao.ADMIN) return true

    const { modulo, nivel: nivelRequerido } = metadados

    const permissaoIndividual = await this.prisma.usuarioPermissao.findFirst({
      where: {
        usuarioId: usuario.id,
        modulo: { nome: modulo, ativo: true },
      },
    })

    if (permissaoIndividual) {
      return this.nivelSuficiente(permissaoIndividual.nivel, nivelRequerido)
    }

    const permissoesGrupo = await this.prisma.grupoAcessoPermissao.findMany({
      where: {
        grupoAcesso: {
          ativo: true,
          membros: { some: { usuarioId: usuario.id } },
        },
        modulo: { nome: modulo, ativo: true },
      },
      select: { nivel: true },
    })

    if (permissoesGrupo.length > 0) {
      const nivelMaior = this.maiorNivel(permissoesGrupo.map((p) => p.nivel))
      return this.nivelSuficiente(nivelMaior, nivelRequerido)
    }

    return false
  }

  private nivelSuficiente(atual: NivelPermissao, requerido: NivelPermissao): boolean {
    return this.hierarquia[atual] >= this.hierarquia[requerido]
  }

  private maiorNivel(niveis: NivelPermissao[]): NivelPermissao {
    return niveis.reduce((maior, atual) =>
      this.hierarquia[atual] > this.hierarquia[maior] ? atual : maior,
    )
  }
}
