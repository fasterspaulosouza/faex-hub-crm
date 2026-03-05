import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { 
  AuthLoginResponseDTO, 
  AuthCadastroResponseDTO,
  AuthEsqueciSenhaResponseDTO,
  AuthVerificarCodigoResponseDTO
} from '../dto/auth-response.dto'

export const LoginSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Realizar login',
      description: 'Autentica usuário com email e senha. Se MFA estiver ativo, retorna token pendente para verificação MFA em vez do token de acesso.'
    }),
    ApiResponse({
      status: 200,
      description: 'Login realizado com sucesso ou MFA pendente',
      type: AuthLoginResponseDTO
    }),
    ApiResponse({
      status: 401,
      description: 'Email e/ou senha incorretos'
    }),
    ApiResponse({
      status: 400,
      description: 'Dados de entrada inválidos'
    })
  )

export const CadastroSwagger = () =>
  applyDecorators(
    ApiOperation({ 
      summary: 'Cadastrar novo usuário',
      description: 'Registra um novo usuário no sistema'
    }),
    ApiResponse({ 
      status: 201, 
      description: 'Usuário cadastrado com sucesso',
      type: AuthCadastroResponseDTO
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Dados inválidos ou email já cadastrado'
    })
  )

export const CadastroV2Swagger = () =>
  applyDecorators(
    ApiOperation({ 
      summary: 'Cadastrar usuário de vendas (provisório)',
      description: 'Registra um novo usuário de vendas - rota temporária'
    }),
    ApiResponse({ 
      status: 201, 
      description: 'Usuário de vendas cadastrado com sucesso'
    })
  )

export const EsqueciSenhaSwagger = () =>
  applyDecorators(
    ApiOperation({ 
      summary: 'Solicitar recuperação de senha',
      description: 'Envia código de recuperação por email'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Email de recuperação enviado com sucesso',
      type: AuthEsqueciSenhaResponseDTO
    }),
    ApiResponse({ 
      status: 404, 
      description: 'Email não encontrado no sistema'
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Email inválido'
    })
  )

export const VerificarCodigoSwagger = () =>
  applyDecorators(
    ApiOperation({ 
      summary: 'Verificar código de recuperação',
      description: 'Valida código de 6 dígitos enviado por email'
    }),
    ApiParam({ 
      name: 'codigo', 
      description: 'Código de 6 dígitos recebido por email',
      example: '123456'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Código válido, token retornado',
      type: AuthVerificarCodigoResponseDTO
    }),
    ApiResponse({ 
      status: 401, 
      description: 'Código inválido, expirado ou já utilizado'
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Formato de código inválido'
    })
  )

export const RedefinirSenhaSwagger = () =>
  applyDecorators(
    ApiOperation({ 
      summary: 'Redefinir senha',
      description: 'Define nova senha usando token de recuperação'
    }),
    ApiParam({ 
      name: 'token', 
      description: 'Token de redefinição obtido na verificação do código',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Senha redefinida com sucesso'
    }),
    ApiResponse({ 
      status: 401, 
      description: 'Token inválido ou expirado'
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Nova senha não atende aos critérios de segurança'
    })
  )