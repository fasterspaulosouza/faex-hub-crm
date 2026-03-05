import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'

export function BuscarAmizadesSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar amizades do usuário autenticado (aceitas)' }),
    ApiQuery({ name: 'pagina', required: false, type: Number }),
    ApiQuery({ name: 'limite', required: false, type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Lista de amizades' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function BuscarPendentesSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar solicitações de amizade recebidas e pendentes' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Lista de solicitações pendentes' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function BuscarEnviadasSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar solicitações de amizade enviadas pelo usuário' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Lista de solicitações enviadas' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function EnviarSolicitacaoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Enviar solicitação de amizade' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'Solicitação enviada' }),
    ApiResponse({ status: HttpStatus.CONFLICT, description: 'Solicitação já existe' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Não pode adicionar a si mesmo' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuário não encontrado' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function AceitarSolicitacaoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Aceitar solicitação de amizade' }),
    ApiParam({ name: 'id', type: Number, description: 'ID da solicitação' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Solicitação aceita' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Solicitação não encontrada' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Sem permissão para aceitar esta solicitação' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function RejeitarSolicitacaoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Rejeitar solicitação de amizade' }),
    ApiParam({ name: 'id', type: Number, description: 'ID da solicitação' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Solicitação rejeitada' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Solicitação não encontrada' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Sem permissão para rejeitar esta solicitação' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function RemoverAmizadeSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remover amizade ou cancelar solicitação enviada' }),
    ApiParam({ name: 'id', type: Number, description: 'ID da amizade/solicitação' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Amizade removida' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Amizade não encontrada' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Sem permissão' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}
