export interface MfaConfigResponse {
  segredo: string
  qrCodeUrl: string
  otpauthUrl: string
}

export interface MfaAtivarResponse {
  mensagem: string
  codigosBackup: string[]
}

export interface MfaStatusResponse {
  mfaAtivo: boolean
}

export interface MfaLoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  usuario: {
    id: number
    nome: string
    email: string
  }
}

export interface MfaPendenteResponse {
  mfaRequerido: true
  mfaPendenteToken: string
  mensagem: string
}
