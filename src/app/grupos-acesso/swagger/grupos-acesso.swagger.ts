import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger'

export function BuscarGruposAcessoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar grupos de acesso com filtros' }),
    ApiQuery({ name: 'buscaPor', required: false, description: 'Busca por nome ou descrição' }),
    ApiQuery({ name: 'ativo', required: false, type: Boolean }),
    ApiQuery({ name: 'pagina', required: false, type: Number }),
    ApiQuery({ name: 'limite', required: false, type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Lista de grupos' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}

export function BuscarGrupoAcessoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Buscar grupo de acesso por ID (inclui membros e permissões)' }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Grupo encontrado' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grupo não encontrado' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}

export function CriarGrupoAcessoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Criar novo grupo de acesso' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'Grupo criado com sucesso' }),
    ApiResponse({ status: HttpStatus.CONFLICT, description: 'Nome já existe' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}

export function AtualizarGrupoAcessoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Atualizar grupo de acesso' }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Grupo atualizado' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grupo não encontrado' }),
    ApiResponse({ status: HttpStatus.CONFLICT, description: 'Nome já existe' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}

export function RemoverGrupoAcessoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Desativar grupo de acesso (soft delete)' }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Grupo desativado' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grupo não encontrado' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}

export function AdicionarMembroSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Adicionar utilizador ao grupo de acesso' }),
    ApiParam({ name: 'id', type: Number, description: 'ID do grupo' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'Membro adicionado' }),
    ApiResponse({ status: HttpStatus.CONFLICT, description: 'Utilizador já é membro' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grupo ou utilizador não encontrado' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}

export function RemoverMembroSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remover utilizador do grupo de acesso' }),
    ApiParam({ name: 'id', type: Number, description: 'ID do grupo' }),
    ApiParam({ name: 'usuarioId', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Membro removido' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Membro não encontrado' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}

export function BuscarMembrosSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar membros do grupo de acesso' }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Lista de membros' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grupo não encontrado' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}

export function AtribuirPermissaoGrupoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Atribuir ou atualizar permissão do grupo para um módulo' }),
    ApiParam({ name: 'id', type: Number, description: 'ID do grupo' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Permissão atribuída' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grupo ou módulo não encontrado' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}

export function RemoverPermissaoGrupoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remover permissão do grupo para um módulo' }),
    ApiParam({ name: 'id', type: Number, description: 'ID do grupo' }),
    ApiParam({ name: 'moduloId', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Permissão removida' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Permissão não encontrada' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}

export function BuscarPermissoesGrupoSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar permissões do grupo de acesso por módulo' }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Lista de permissões' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Grupo não encontrado' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}
