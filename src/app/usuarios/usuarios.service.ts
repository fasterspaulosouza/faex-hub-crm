import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { CreateUsuarioDto } from './dto/create-usuario.dto'
import { UpdateUsuarioDto } from './dto/update-usuario.dto'
import { SearchUsuarioDto } from './dto/search-usuario.dto'
import { PrismaService } from 'src/common/modules/prisma/prisma.service'
import { TokenService } from 'src/common/modules/token/token.service'
import { BaseSearchService } from 'src/common/services/base-search.service'
import { NivelPermissao, UsuarioFuncao, Usuario } from '@prisma/client'
import { generatePassword } from 'src/utils/geradorSenha.util'
import { CreateAuthVendasDto } from '../auth/dto/auth-register-vendas.dto'
import { MailService } from 'src/common/external/mail/mail.service'
import * as bcrypt from 'bcrypt'
import {
  FiltrosUsuario,
  UsuarioListResponse,
  UsuarioSeguro,
  UsuarioStats,
} from './interfaces/usuario.interface'

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name)

  constructor(
    private prismaService: PrismaService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async buscarTodos(
    options: FiltrosUsuario = {},
  ): Promise<UsuarioListResponse> {
    const { pagina = 1, limite = 10 } = options

    // Usar BaseSearchService para normalizar paginação
    const {
      skip,
      take,
      pagina: paginaNormalizada,
      limite: limiteNormalizado,
    } = BaseSearchService.normalizarPaginacao(Number(pagina), Number(limite))

    this.logger.log(
      `Buscando usuários - Página: ${pagina}, Limite: ${limite}, Skip: ${skip}`,
    )

    try {
      const [data, total] = await Promise.all([
        this.prismaService.usuario.findMany({
          where: {
            funcao: {
              in: [UsuarioFuncao.PARCEIRO, UsuarioFuncao.ORGANIZACAO],
            },
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          omit: { senha: true },
        }),
        this.prismaService.usuario.count({
          where: {
            funcao: {
              in: [UsuarioFuncao.PARCEIRO, UsuarioFuncao.ORGANIZACAO],
            },
          },
        }),
      ])

      const result = BaseSearchService.criarRespostaPaginada(
        data,
        total,
        paginaNormalizada,
        limiteNormalizado,
      )

      this.logger.log(`${total} usuários encontrados`)

      return result
    } catch (error) {
      this.logger.error('Erro ao buscar usuários:', error.message)
      throw new BadRequestException('Erro ao buscar usuários.')
    }
  }

  async buscarComFiltros(
    searchDto: SearchUsuarioDto,
  ): Promise<UsuarioListResponse> {
    const {
      funcao,
      status,
      genero,
      departamento,
      ativo,
      verificado,
      ...opcoesBusca
    } = searchDto

    this.logger.log(
      'Executando busca avançada de usuários com filtros:',
      searchDto,
    )

    try {
      // Campos onde a busca de texto será aplicada
      const camposBusca = ['nome', 'email', 'documento', 'telefone']

      // Condições extras específicas de usuários
      const condicoesExtras: any[] = []

      // Filtrar função: apenas PARCEIRO ou ORGANIZACAO são permitidos
      if (funcao) {
        if (
          funcao === UsuarioFuncao.PARCEIRO ||
          funcao === UsuarioFuncao.ORGANIZACAO
        ) {
          condicoesExtras.push({ funcao })
        } else {
          condicoesExtras.push({
            funcao: { in: [UsuarioFuncao.PARCEIRO, UsuarioFuncao.ORGANIZACAO] },
          })
        }
      } else {
        condicoesExtras.push({
          funcao: { in: [UsuarioFuncao.PARCEIRO, UsuarioFuncao.ORGANIZACAO] },
        })
      }

      if (status) {
        condicoesExtras.push({ status })
      }

      if (genero) {
        condicoesExtras.push({ genero })
      }

      if (departamento) {
        condicoesExtras.push({ departamento })
      }

      if (ativo !== undefined) {
        condicoesExtras.push({ ativo: Boolean(ativo) })
      }

      if (verificado !== undefined) {
        condicoesExtras.push({ verificado: Boolean(verificado) })
      }

      // Relacionamentos a incluir
      const includeRelations = {
        endereco: true,
      }

      // Executar busca usando BaseSearchService unificado
      const resultado = await BaseSearchService.executarBuscaCompleta<Usuario>(
        this.prismaService.usuario,
        opcoesBusca,
        camposBusca,
        condicoesExtras,
        includeRelations,
      )

      this.logger.log(
        `Busca avançada concluída: ${resultado.total} usuários encontrados`,
      )

      return resultado
    } catch (error) {
      this.logger.error(
        `Erro na busca avançada de usuários: ${error.message}`,
        error.stack,
      )
      throw new BadRequestException(
        'Erro interno na busca avançada de usuários',
      )
    }
  }

  async buscar(id: number): Promise<UsuarioSeguro> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException(
        'ID do usuário deve ser um número inteiro positivo.',
      )
    }

    this.logger.log(`Buscando usuário com ID: ${id}`)

    try {
      const usuario = await this.prismaService.usuario.findUnique({
        where: { id },
        omit: { senha: true },
      })

      if (!usuario) {
        this.logger.warn(`Usuário com ID ${id} não encontrado`)
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`)
      }

      this.logger.log(`Usuário com ID ${id} encontrado com sucesso`)
      return usuario
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      this.logger.error(`Erro ao buscar usuário ID ${id}:`, error.message)
      throw new BadRequestException('Erro ao buscar usuário.')
    }
  }

  async buscarPorFuncao(funcao: UsuarioFuncao) {
    if (funcao === UsuarioFuncao.ADMIN) {
      return this.prismaService.usuario.findMany({
        where: { funcao: { in: [UsuarioFuncao.ADMIN, UsuarioFuncao.USUARIO] } },
      })
    }

    return this.prismaService.usuario.findMany({ where: { funcao } })
  }

  async buscaPorEmail(email: string) {
    return this.prismaService.usuario.findFirst({
      where: {
        email,
      },
    })
  }

  async buscaPorDocumento(documento: string) {
    return this.prismaService.usuario.findFirst({
      where: {
        documento,
      },
    })
  }

  async criarUsuarioExterno(createUsuarioDto: CreateUsuarioDto) {
    this.atribuirFuncaoRegistro(createUsuarioDto.funcao)

    await this.garantirUsuarioExista({ email: createUsuarioDto.email })
    if (createUsuarioDto.documento) {
      await this.garantirUsuarioExista({
        documento: createUsuarioDto.documento,
      })
    }

    const salt = await bcrypt.genSalt()
    createUsuarioDto.senha = await bcrypt.hash(createUsuarioDto.senha, salt)

    const usuario = await this.prismaService.usuario.create({
      data: createUsuarioDto,
    })

    const token = this.tokenService.createToken(usuario)

    await this.mailService.send({
      to: usuario.email,
      subject: 'Bem vindo',
      template: 'bem-vindo/welcome',
      data: {
        nome: usuario.nome,
        email: usuario.email,
        token: token.accessToken,
      },
    })

    return token
  }

  // Função provisória
  async criarUsuarioExternoV2(createAuthVendasDto: CreateAuthVendasDto) {
    let usuario = await this.buscaPorEmail(createAuthVendasDto.email)

    if (!usuario) {
      const { senha, hash } = await generatePassword()

      usuario = await this.prismaService.usuario.create({
        data: {
          nome: createAuthVendasDto.nome,
          email: createAuthVendasDto.email,
          senha: hash,
        },
      })

      await this.mailService.send({
        to: usuario.email,
        subject: 'Bem vindo',
        template: 'bem-vindo/complete-account',
        data: {
          nome: usuario.nome,
          senha,
        },
      })
    }

    return this.tokenService.createToken(usuario)
  }

  async cadastrarUsuarioInterno(createUsuarioDto: CreateUsuarioDto) {
    await this.garantirUsuarioExista({ email: createUsuarioDto.email })
    if (createUsuarioDto.documento) {
      await this.garantirUsuarioExista({
        documento: createUsuarioDto.documento,
      })
    }

    const salt = await bcrypt.genSalt()
    createUsuarioDto.senha = await bcrypt.hash(createUsuarioDto.senha, salt)

    return this.prismaService.usuario.create({
      data: createUsuarioDto,
    })
  }

  async atualizarUsuario(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.usuarioExistente(id)

    const salt = await bcrypt.genSalt()

    if (updateUsuarioDto.senha) {
      updateUsuarioDto.senha = await bcrypt.hash(updateUsuarioDto.senha, salt)
    }

    return this.prismaService.usuario.update({
      data: updateUsuarioDto,
      where: {
        id,
      },
    })
  }

  async remover(id: number) {
    await this.usuarioExistente(id)

    return this.prismaService.usuario.delete({
      where: {
        id,
      },
    })
  }

  async usuarioExistente(id: number) {
    if (!(await this.buscar(id))) {
      throw new NotFoundException(`O usuário ID ${id} não foi encontrado!`)
    }
  }

  async garantirUsuarioExista(
    where: Partial<{ email: string; documento: string }>,
  ) {
    const usuarioExistente = await this.prismaService.usuario.findFirst({
      where,
    })

    if (usuarioExistente) {
      const key = Object.keys(where)[0]
      const value = Object.values(where)[0]

      throw new BadRequestException(
        `O ${key === 'email' ? 'e-mail' : 'documento'} "${value}" já está em uso!`,
      )
    }
  }

  atribuirFuncaoRegistro(funcao: UsuarioFuncao = UsuarioFuncao.PARCEIRO): void {
    const funcoesPermitidas = new Set<UsuarioFuncao>([
      UsuarioFuncao.PARCEIRO,
      UsuarioFuncao.ORGANIZACAO,
    ])

    if (!funcoesPermitidas.has(funcao)) {
      throw new BadRequestException('Funcao inválida para registro.')
    }
  }

  async alterarSenha(id: number, senhaAtual: string, novaSenha: string) {
    if (!novaSenha) {
      throw new BadRequestException('New Password is required')
    }

    await this.checarSenha(id, senhaAtual)

    return this.atualizarSenha(id, novaSenha)
  }

  async checarSenha(id: number, senha: string) {
    const usuario = await this.prismaService.usuario.findUnique({
      where: { id },
    })

    if (!usuario) {
      throw new NotFoundException(`O usuário ID ${id} não foi encontrado!`)
    }

    const checked = await bcrypt.compare(senha, usuario.senha)

    if (!checked) throw new UnauthorizedException('Senha incorreta')

    return true
  }

  async atualizarSenha(id: number, senha: string) {
    await this.usuarioExistente(id)

    const userUpdated = await this.prismaService.usuario.update({
      where: {
        id,
      },
      data: {
        senha: bcrypt.hashSync(senha, 10),
      },
    })

    return userUpdated
  }

  async buscarPermissoes(usuarioId: number) {
    await this.buscar(usuarioId)

    return this.prismaService.usuarioPermissao.findMany({
      where: { usuarioId },
      include: { modulo: { select: { id: true, nome: true, descricao: true } } },
    })
  }

  async atribuirPermissao(usuarioId: number, dto: { moduloId: number; nivel: NivelPermissao }) {
    await this.buscar(usuarioId)

    const modulo = await this.prismaService.modulo.findFirst({
      where: { id: dto.moduloId, ativo: true },
    })

    if (!modulo) {
      throw new NotFoundException(`Módulo com ID ${dto.moduloId} não encontrado`)
    }

    try {
      return await this.prismaService.usuarioPermissao.upsert({
        where: { usuarioId_moduloId: { usuarioId, moduloId: dto.moduloId } },
        create: { usuarioId, moduloId: dto.moduloId, nivel: dto.nivel },
        update: { nivel: dto.nivel },
        include: { modulo: { select: { id: true, nome: true, descricao: true } } },
      })
    } catch (error) {
      this.logger.error(`Erro ao atribuir permissão: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao atribuir permissão')
    }
  }

  async removerPermissao(usuarioId: number, moduloId: number) {
    await this.buscar(usuarioId)

    const permissao = await this.prismaService.usuarioPermissao.findUnique({
      where: { usuarioId_moduloId: { usuarioId, moduloId } },
    })

    if (!permissao) {
      throw new NotFoundException('Permissão não encontrada para este utilizador e módulo')
    }

    try {
      await this.prismaService.usuarioPermissao.delete({
        where: { usuarioId_moduloId: { usuarioId, moduloId } },
      })
      return { mensagem: 'Permissão removida com sucesso' }
    } catch (error) {
      this.logger.error(`Erro ao remover permissão: ${error.message}`, error.stack)
      throw new BadRequestException('Erro interno ao remover permissão')
    }
  }

  async buscarEstatisticas(): Promise<UsuarioStats> {
    this.logger.log('Buscando estatísticas de usuários')

    try {
      const [
        totalUsuarios,
        usuariosAtivos,
        usuariosInativos,
        cadastrosRecentes,
      ] = await Promise.all([
        this.prismaService.usuario.count(),
        this.prismaService.usuario.count({ where: { ativo: true } }),
        this.prismaService.usuario.count({ where: { ativo: false } }),
        this.prismaService.usuario.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // últimos 30 dias
            },
          },
        }),
      ])
      const usuariosComEnderecos = 0

      // Buscar estatísticas por função
      const [adminCount, usuarioCount, parceiroCount, organizacaoCount] =
        await Promise.all([
          this.prismaService.usuario.count({ where: { funcao: 'ADMIN' } }),
          this.prismaService.usuario.count({ where: { funcao: 'USUARIO' } }),
          this.prismaService.usuario.count({ where: { funcao: 'PARCEIRO' } }),
          this.prismaService.usuario.count({
            where: { funcao: 'ORGANIZACAO' },
          }),
        ])

      // Buscar estatísticas por status
      const [novoCount, aprovadoCount, atualizadoCount, incompletoCount] =
        await Promise.all([
          this.prismaService.usuario.count({
            where: { status: 'NOVO' as any },
          }),
          this.prismaService.usuario.count({
            where: { status: 'APROVADO' as any },
          }),
          this.prismaService.usuario.count({
            where: { status: 'ATUALIZADO' as any },
          }),
          this.prismaService.usuario.count({
            where: { status: 'INCOMPLETO' as any },
          }),
        ])

      const stats: UsuarioStats = {
        totalUsuarios,
        usuariosAtivos,
        usuariosInativos,
        usuariosPorFuncao: [
          { funcao: 'ADMIN' as UsuarioFuncao, total: adminCount },
          { funcao: 'USUARIO' as UsuarioFuncao, total: usuarioCount },
          { funcao: 'PARCEIRO' as UsuarioFuncao, total: parceiroCount },
          { funcao: 'ORGANIZACAO' as UsuarioFuncao, total: organizacaoCount },
        ].filter((item) => item.total > 0),
        usuariosPorStatus: [
          { status: 'NOVO' as any, total: novoCount },
          { status: 'APROVADO' as any, total: aprovadoCount },
          { status: 'ATUALIZADO' as any, total: atualizadoCount },
          { status: 'INCOMPLETO' as any, total: incompletoCount },
        ].filter((item) => item.total > 0),
        usuariosPorGenero: [],
        usuariosPorDepartamento: [],
        usuariosComEnderecos,
        cadastrosRecentes,
      }

      this.logger.log('Estatísticas de usuários obtidas com sucesso')
      return stats
    } catch (error) {
      this.logger.error('Erro ao buscar estatísticas:', error.message)
      throw new BadRequestException('Erro ao buscar estatísticas de usuários.')
    }
  }
}
