import { applyDecorators } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'

export const ConfigurarMfaSwagger = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Configurar MFA',
      description:
        'Gera segredo TOTP e QR code para configuração no aplicativo autenticador',
    }),
    ApiResponse({
      status: 201,
      description: 'Configuração gerada com sucesso',
    }),
    ApiResponse({
      status: 400,
      description: 'MFA já está ativo para este usuário',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autenticado',
    }),
  )

export const AtivarMfaSwagger = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Ativar MFA',
      description:
        'Verifica código TOTP e ativa MFA, retornando 10 códigos de backup',
    }),
    ApiResponse({
      status: 200,
      description: 'MFA ativado com sucesso, códigos de backup retornados',
    }),
    ApiResponse({
      status: 400,
      description: 'MFA não configurado ou já ativo',
    }),
    ApiResponse({
      status: 401,
      description: 'Código TOTP inválido ou não autenticado',
    }),
  )

export const DesativarMfaSwagger = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Desativar MFA',
      description: 'Desativa MFA após confirmação de senha',
    }),
    ApiResponse({
      status: 200,
      description: 'MFA desativado com sucesso',
    }),
    ApiResponse({
      status: 400,
      description: 'MFA não está ativo',
    }),
    ApiResponse({
      status: 401,
      description: 'Senha incorreta ou não autenticado',
    }),
  )

export const StatusMfaSwagger = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Verificar status MFA',
      description: 'Retorna se o MFA está ativo para o usuário autenticado',
    }),
    ApiResponse({
      status: 200,
      description: 'Status retornado com sucesso',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autenticado',
    }),
  )

export const RegenerarBackupSwagger = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Regenerar códigos de backup',
      description:
        'Gera novos 10 códigos de backup, invalidando os anteriores',
    }),
    ApiResponse({
      status: 200,
      description: 'Novos códigos de backup gerados',
    }),
    ApiResponse({
      status: 400,
      description: 'MFA não está ativo',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autenticado',
    }),
  )

export const VerificarMfaSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Verificar código MFA no login',
      description:
        'Segunda etapa do login: verifica código TOTP e retorna token de acesso completo',
    }),
    ApiResponse({
      status: 200,
      description: 'Código verificado, token de acesso retornado',
    }),
    ApiResponse({
      status: 401,
      description: 'Código MFA inválido ou token pendente expirado',
    }),
    ApiResponse({
      status: 403,
      description: 'MFA bloqueado por excesso de tentativas',
    }),
  )

export const VerificarBackupSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Verificar código de backup no login',
      description:
        'Segunda etapa do login usando código de backup em vez do TOTP',
    }),
    ApiResponse({
      status: 200,
      description: 'Código de backup verificado, token de acesso retornado',
    }),
    ApiResponse({
      status: 401,
      description: 'Código de backup inválido ou token pendente expirado',
    }),
    ApiResponse({
      status: 403,
      description: 'MFA bloqueado por excesso de tentativas',
    }),
  )
