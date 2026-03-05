import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from 'src/common/modules/prisma/prisma.service'
import { TokenService } from 'src/common/modules/token/token.service'
import { IssuerJWT } from 'src/common/enums/jwt.enum'
import {
  generateSecret,
  generateURI,
  verifySync,
} from 'otplib'
import * as QRCode from 'qrcode'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import {
  MfaConfigResponse,
  MfaAtivarResponse,
  MfaStatusResponse,
  MfaLoginResponse,
} from './interfaces/mfa.interface'

@Injectable()
export class MfaService {
  private readonly logger = new Logger(MfaService.name)

  private readonly MAX_TENTATIVAS = 5
  private readonly BLOQUEIO_MINUTOS = 15
  private readonly TOTAL_CODIGOS_BACKUP = 10
  private readonly NOME_EMISSOR = 'Faex Hub ERP'

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async gerarConfiguracao(usuarioId: number): Promise<MfaConfigResponse> {
    this.logger.log(`Gerando configuração MFA para usuário ID: ${usuarioId}`)

    const mfaExistente = await this.prisma.usuarioMfa.findUnique({
      where: { usuarioId },
    })

    if (mfaExistente?.ativo) {
      throw new BadRequestException(
        'MFA já está ativo para este usuário. Desative primeiro para reconfigurar.',
      )
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    })

    if (!usuario) {
      throw new NotFoundException(
        `Usuário com ID ${usuarioId} não encontrado`,
      )
    }

    const segredo = generateSecret()

    await this.prisma.usuarioMfa.upsert({
      where: { usuarioId },
      create: { usuarioId, segredo, ativo: false },
      update: { segredo, ativo: false, tentativasErro: 0, bloqueadoAte: null },
    })

    const otpauthUrl = generateURI({
      label: usuario.email,
      issuer: this.NOME_EMISSOR,
      secret: segredo,
    })
    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl)

    return { segredo, qrCodeUrl, otpauthUrl }
  }

  async ativar(
    usuarioId: number,
    codigo: string,
  ): Promise<MfaAtivarResponse> {
    this.logger.log(`Ativando MFA para usuário ID: ${usuarioId}`)

    const mfa = await this.prisma.usuarioMfa.findUnique({
      where: { usuarioId },
    })

    if (!mfa) {
      throw new BadRequestException(
        'Configure o MFA primeiro usando o endpoint de configuração.',
      )
    }

    if (mfa.ativo) {
      throw new BadRequestException('MFA já está ativo.')
    }

    const valido = verifySync({ token: codigo, secret: mfa.segredo }).valid

    if (!valido) {
      throw new UnauthorizedException(
        'Código TOTP inválido. Verifique o aplicativo autenticador.',
      )
    }

    const codigosBackup = this.gerarCodigosBackup()
    const codigosHash = await this.hashearCodigosBackup(codigosBackup)

    await this.prisma.$transaction(async (tx) => {
      await tx.usuarioMfa.update({
        where: { id: mfa.id },
        data: { ativo: true, tentativasErro: 0, bloqueadoAte: null },
      })

      await tx.usuarioMfaBackupCode.deleteMany({
        where: { usuarioMfaId: mfa.id },
      })

      await tx.usuarioMfaBackupCode.createMany({
        data: codigosHash.map((hash) => ({
          usuarioMfaId: mfa.id,
          codigoHash: hash,
        })),
      })
    })

    this.logger.log(`MFA ativado com sucesso para usuário ID: ${usuarioId}`)

    return {
      mensagem:
        'MFA ativado com sucesso! Guarde os códigos de backup em local seguro.',
      codigosBackup,
    }
  }

  async desativar(
    usuarioId: number,
    senha: string,
  ): Promise<{ mensagem: string }> {
    this.logger.log(`Desativando MFA para usuário ID: ${usuarioId}`)

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    })

    if (!usuario) {
      throw new NotFoundException(
        `Usuário com ID ${usuarioId} não encontrado`,
      )
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

    if (!senhaCorreta) {
      throw new UnauthorizedException('Senha incorreta.')
    }

    const mfa = await this.prisma.usuarioMfa.findUnique({
      where: { usuarioId },
    })

    if (!mfa || !mfa.ativo) {
      throw new BadRequestException(
        'MFA não está ativo para este usuário.',
      )
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.usuarioMfaBackupCode.deleteMany({
        where: { usuarioMfaId: mfa.id },
      })
      await tx.usuarioMfa.delete({ where: { id: mfa.id } })
    })

    this.logger.log(
      `MFA desativado com sucesso para usuário ID: ${usuarioId}`,
    )

    return { mensagem: 'MFA desativado com sucesso.' }
  }

  async verificarCodigoLogin(
    token: string,
    codigo: string,
  ): Promise<MfaLoginResponse> {
    const payload = this.tokenService.checkToken(
      token,
      IssuerJWT.MFA_PENDENTE,
    )
    const usuarioId = +payload.id

    const mfa = await this.prisma.usuarioMfa.findUnique({
      where: { usuarioId },
    })

    if (!mfa || !mfa.ativo) {
      throw new UnauthorizedException(
        'MFA não está configurado para este usuário.',
      )
    }

    await this.verificarBloqueio(mfa)

    const valido = verifySync({ token: codigo, secret: mfa.segredo }).valid

    if (!valido) {
      await this.registrarTentativaFalha(mfa.id, mfa.tentativasErro)
      throw new UnauthorizedException('Código MFA inválido.')
    }

    await this.resetarTentativas(mfa.id)

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    })

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${usuarioId} não encontrado`)
    }

    const tokenResult = this.tokenService.createToken(usuario)

    return {
      accessToken: tokenResult.accessToken,
      tokenType: 'Bearer',
      expiresIn: 86400,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    }
  }

  async verificarCodigoBackup(
    token: string,
    codigoBackup: string,
  ): Promise<MfaLoginResponse> {
    const payload = this.tokenService.checkToken(
      token,
      IssuerJWT.MFA_PENDENTE,
    )
    const usuarioId = +payload.id

    const mfa = await this.prisma.usuarioMfa.findUnique({
      where: { usuarioId },
      include: { codigosBackup: { where: { utilizado: false } } },
    })

    if (!mfa || !mfa.ativo) {
      throw new UnauthorizedException(
        'MFA não está configurado para este usuário.',
      )
    }

    await this.verificarBloqueio(mfa)

    let codigoEncontrado: (typeof mfa.codigosBackup)[number] | null = null

    for (const backup of mfa.codigosBackup) {
      const corresponde = await bcrypt.compare(codigoBackup, backup.codigoHash)
      if (corresponde) {
        codigoEncontrado = backup
        break
      }
    }

    if (!codigoEncontrado) {
      await this.registrarTentativaFalha(mfa.id, mfa.tentativasErro)
      throw new UnauthorizedException('Código de backup inválido.')
    }

    await this.prisma.usuarioMfaBackupCode.update({
      where: { id: codigoEncontrado.id },
      data: { utilizado: true, utilizadoEm: new Date() },
    })

    await this.resetarTentativas(mfa.id)

    const restantes = mfa.codigosBackup.filter(
      (c) => !c.utilizado && c.id !== codigoEncontrado!.id,
    ).length

    this.logger.warn(
      `Usuário ${usuarioId} usou código backup. Restantes: ${restantes}`,
    )

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    })

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${usuarioId} não encontrado`)
    }

    const tokenResult = this.tokenService.createToken(usuario)

    return {
      accessToken: tokenResult.accessToken,
      tokenType: 'Bearer',
      expiresIn: 86400,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    }
  }

  async regenerarCodigosBackup(
    usuarioId: number,
  ): Promise<MfaAtivarResponse> {
    this.logger.log(
      `Regenerando códigos de backup para usuário ID: ${usuarioId}`,
    )

    const mfa = await this.prisma.usuarioMfa.findUnique({
      where: { usuarioId },
    })

    if (!mfa || !mfa.ativo) {
      throw new BadRequestException(
        'MFA não está ativo. Ative o MFA primeiro.',
      )
    }

    const codigosBackup = this.gerarCodigosBackup()
    const codigosHash = await this.hashearCodigosBackup(codigosBackup)

    await this.prisma.$transaction(async (tx) => {
      await tx.usuarioMfaBackupCode.deleteMany({
        where: { usuarioMfaId: mfa.id },
      })

      await tx.usuarioMfaBackupCode.createMany({
        data: codigosHash.map((hash) => ({
          usuarioMfaId: mfa.id,
          codigoHash: hash,
        })),
      })
    })

    this.logger.log(
      `Códigos de backup regenerados para usuário ID: ${usuarioId}`,
    )

    return {
      mensagem:
        'Novos códigos de backup gerados! Guarde-os em local seguro.',
      codigosBackup,
    }
  }

  async verificarStatus(usuarioId: number): Promise<MfaStatusResponse> {
    const mfa = await this.prisma.usuarioMfa.findUnique({
      where: { usuarioId },
    })

    return { mfaAtivo: !!mfa?.ativo }
  }

  async usuarioTemMfa(usuarioId: number): Promise<boolean> {
    const mfa = await this.prisma.usuarioMfa.findUnique({
      where: { usuarioId },
      select: { ativo: true },
    })

    return !!mfa?.ativo
  }

  // --- Helpers privados ---

  private gerarCodigosBackup(): string[] {
    return Array.from({ length: this.TOTAL_CODIGOS_BACKUP }, () =>
      crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 8),
    )
  }

  private async hashearCodigosBackup(codigos: string[]): Promise<string[]> {
    return Promise.all(codigos.map((c) => bcrypt.hash(c, 10)))
  }

  private async verificarBloqueio(mfa: {
    tentativasErro: number
    bloqueadoAte: Date | null
  }): Promise<void> {
    if (mfa.bloqueadoAte && mfa.bloqueadoAte > new Date()) {
      const minutosRestantes = Math.ceil(
        (mfa.bloqueadoAte.getTime() - Date.now()) / 60000,
      )
      throw new ForbiddenException(
        `MFA bloqueado por excesso de tentativas. Tente novamente em ${minutosRestantes} minuto(s).`,
      )
    }
  }

  private async registrarTentativaFalha(
    mfaId: number,
    tentativasAtual: number,
  ): Promise<void> {
    const novasTentativas = tentativasAtual + 1
    const dados: any = { tentativasErro: novasTentativas }

    if (novasTentativas >= this.MAX_TENTATIVAS) {
      dados.bloqueadoAte = new Date(
        Date.now() + this.BLOQUEIO_MINUTOS * 60 * 1000,
      )
      dados.tentativasErro = 0
      this.logger.warn(
        `MFA bloqueado para usuarioMfaId=${mfaId} após ${this.MAX_TENTATIVAS} tentativas`,
      )
    }

    await this.prisma.usuarioMfa.update({
      where: { id: mfaId },
      data: dados,
    })
  }

  private async resetarTentativas(mfaId: number): Promise<void> {
    await this.prisma.usuarioMfa.update({
      where: { id: mfaId },
      data: { tentativasErro: 0, bloqueadoAte: null },
    })
  }
}
