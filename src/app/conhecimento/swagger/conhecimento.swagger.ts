import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'

export function BuscarConhecimentosSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar publicações de conhecimento com filtros' }),
    ApiQuery({ name: 'visibilidade', required: false, enum: ['PRIVADO', 'PUBLICO'] }),
    ApiQuery({ name: 'ativo', required: false, type: Boolean }),
    ApiQuery({ name: 'buscaPor', required: false }),
    ApiQuery({ name: 'pagina', required: false, type: Number }),
    ApiQuery({ name: 'limite', required: false, type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Lista de publicações de conhecimento' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function BuscarMeusConhecimentosSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar publicações de conhecimento do usuário autenticado' }),
    ApiQuery({ name: 'pagina', required: false, type: Number }),
    ApiQuery({ name: 'limite', required: false, type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Lista de publicações' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function BuscarConhecimentoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Buscar publicação de conhecimento por ID' }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Publicação encontrada' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Publicação não encontrada' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function CriarConhecimentoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Criar nova publicação de conhecimento' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'Publicação criada' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function AtualizarConhecimentoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Atualizar publicação de conhecimento (somente o autor)' }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Publicação atualizada' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Publicação não encontrada' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Sem permissão' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function RemoverConhecimentoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remover publicação de conhecimento (soft delete, somente o autor)' }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Publicação removida' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Publicação não encontrada' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Sem permissão' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}
