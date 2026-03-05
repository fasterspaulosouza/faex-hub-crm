import { applyDecorators, HttpStatus } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger'

export function BuscarModulosSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar módulos do sistema com filtros' }),
    ApiQuery({ name: 'buscaPor', required: false, description: 'Busca por nome ou descrição' }),
    ApiQuery({ name: 'ativo', required: false, type: Boolean }),
    ApiQuery({ name: 'pagina', required: false, type: Number }),
    ApiQuery({ name: 'limite', required: false, type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Lista de módulos' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}

export function BuscarModuloSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Buscar módulo por ID' }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Módulo encontrado' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Módulo não encontrado' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}

export function CriarModuloSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Criar novo módulo do sistema' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'Módulo criado com sucesso' }),
    ApiResponse({ status: HttpStatus.CONFLICT, description: 'Nome já existe' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}

export function AtualizarModuloSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Atualizar módulo' }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Módulo atualizado' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Módulo não encontrado' }),
    ApiResponse({ status: HttpStatus.CONFLICT, description: 'Nome já existe' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}

export function RemoverModuloSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Desativar módulo (soft delete)' }),
    ApiParam({ name: 'id', type: Number }),
    ApiResponse({ status: HttpStatus.OK, description: 'Módulo desativado' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Módulo não encontrado' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acesso negado' }),
  )
}
