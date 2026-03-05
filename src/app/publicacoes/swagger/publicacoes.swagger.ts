import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'

export function BuscarPublicacoesSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar publicações com filtros e paginação' }),
    ApiQuery({ name: 'tipo', required: false, enum: ['TEXTO', 'IMAGEM', 'VIDEO'] }),
    ApiQuery({ name: 'visibilidade', required: false, enum: ['PUBLICO', 'AMIGOS'] }),
    ApiQuery({ name: 'ativo', required: false, type: Boolean }),
    ApiQuery({ name: 'buscaPor', required: false }),
    ApiQuery({ name: 'pagina', required: false, type: Number }),
    ApiQuery({ name: 'limite', required: false, type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Lista de publicações' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function BuscarMinhasPublicacoesSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar publicações do usuário autenticado' }),
    ApiQuery({ name: 'pagina', required: false, type: Number }),
    ApiQuery({ name: 'limite', required: false, type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Lista de publicações' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function BuscarPublicacaoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Buscar publicação por ID (inclui comentários e curtidas)' }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Publicação encontrada' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Publicação não encontrada' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function CriarPublicacaoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Criar nova publicação' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'Publicação criada' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function AtualizarPublicacaoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Atualizar publicação (somente o autor)' }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Publicação atualizada' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Publicação não encontrada' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Sem permissão' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function RemoverPublicacaoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remover publicação (soft delete, somente o autor)' }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Publicação removida' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Publicação não encontrada' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Sem permissão' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function BuscarComentariosSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar comentários de uma publicação' }),
    ApiParam({ name: 'id', type: Number, description: 'ID da publicação' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Lista de comentários' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Publicação não encontrada' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function AdicionarComentarioSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Adicionar comentário à publicação' }),
    ApiParam({ name: 'id', type: Number, description: 'ID da publicação' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'Comentário adicionado' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Publicação não encontrada' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function RemoverComentarioSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remover comentário (somente o autor ou autor da publicação)' }),
    ApiParam({ name: 'id', type: Number, description: 'ID da publicação' }),
    ApiParam({ name: 'comentarioId', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Comentário removido' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Comentário não encontrado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Sem permissão' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function ToggleCurtidaSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Curtir ou descurtir publicação (toggle)' }),
    ApiParam({ name: 'id', type: Number, description: 'ID da publicação' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Curtida alternada' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Publicação não encontrada' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}

export function BuscarCurtidasSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar usuários que curtiram a publicação' }),
    ApiParam({ name: 'id', type: Number, description: 'ID da publicação' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Lista de curtidas' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Publicação não encontrada' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
  )
}
