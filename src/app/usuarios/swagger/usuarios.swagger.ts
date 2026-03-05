import { applyDecorators } from '@nestjs/common'
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger'
import { UsuarioEntity } from '../entities/usuario.entity'
import { CreateUsuarioDto } from '../dto/create-usuario.dto'
import { UpdateUsuarioDto } from '../dto/update-usuario.dto'

export const BuscarTodosUsuariosSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Buscar todos os usuários',
      description:
        'Retorna uma lista paginada com todos os usuários cadastrados no sistema (sem senha)',
    }),
    ApiQuery({
      name: 'pagina',
      required: false,
      description: 'Número da página para paginação',
      example: 1,
      type: 'number',
    }),
    ApiQuery({
      name: 'limite',
      required: false,
      description: 'Quantidade de itens por página (máximo 100)',
      example: 10,
      type: 'number',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de usuários retornada com sucesso',
      schema: {
        type: 'object',
        properties: {
          dados: {
            type: 'array',
            items: { $ref: '#/components/schemas/UsuarioEntity' },
          },
          total: { type: 'number', example: 100 },
          pagina: { type: 'number', example: 1 },
          limite: { type: 'number', example: 10 },
          totalPaginas: { type: 'number', example: 10 },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Erro de validação nos parâmetros',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado - Token inválido ou expirado',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Permissões insuficientes',
    }),
    ApiBearerAuth(),
  )

export const BuscarComFiltrosSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Buscar usuários com filtros avançados',
      description:
        'Retorna uma lista paginada de usuários com filtros por busca unificada, função, status, etc.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de usuários filtrados retornada com sucesso',
      schema: {
        type: 'object',
        properties: {
          dados: {
            type: 'array',
            items: { $ref: '#/components/schemas/UsuarioEntity' },
          },
          total: { type: 'number', example: 50 },
          pagina: { type: 'number', example: 1 },
          limite: { type: 'number', example: 10 },
          totalPaginas: { type: 'number', example: 5 },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Erro de validação nos parâmetros de busca',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado - Token inválido ou expirado',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Permissões insuficientes',
    }),
    ApiBearerAuth(),
  )

export const BuscarUsuarioSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Buscar usuário por ID',
      description: 'Retorna os dados de um usuário específico (sem senha)',
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'ID do usuário',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Usuário encontrado com sucesso',
      type: UsuarioEntity,
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado - Token inválido ou expirado',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Permissões insuficientes',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário não encontrado',
    }),
    ApiBearerAuth(),
  )

export const BuscarPorFuncaoSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Buscar usuários por função',
      description:
        'Retorna lista de usuários filtrados por função específica no sistema',
    }),
    ApiParam({
      name: 'funcao',
      enum: ['ADMIN', 'USUARIO', 'PARCEIRO', 'ORGANIZACAO'],
      description: 'Função do usuário',
      example: 'PARCEIRO',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuários encontrados com sucesso',
      schema: {
        type: 'array',
        items: { $ref: '#/components/schemas/UsuarioEntity' },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Função inválida',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado - Token inválido ou expirado',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Permissões insuficientes',
    }),
    ApiBearerAuth(),
  )

export const CadastrarUsuarioInternoSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Cadastrar usuário interno',
      description:
        'Cria um novo usuário no sistema (uso interno do ERP). A senha será hasheada automaticamente.',
    }),
    ApiBody({
      type: CreateUsuarioDto,
      description: 'Dados do usuário para cadastro',
    }),
    ApiResponse({
      status: 201,
      description: 'Usuário cadastrado com sucesso',
      type: UsuarioEntity,
    }),
    ApiResponse({
      status: 400,
      description: 'Erro de validação nos dados fornecidos',
      schema: {
        type: 'object',
        properties: {
          message: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } },
            ],
          },
          error: { type: 'string' },
          statusCode: { type: 'number', example: 400 },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado - Token inválido ou expirado',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Permissões insuficientes',
    }),
    ApiResponse({
      status: 409,
      description: 'E-mail ou documento já em uso',
    }),
    ApiBearerAuth(),
  )

export const AtualizarUsuarioSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualizar usuário',
      description:
        'Atualiza os dados de um usuário existente. Se a senha for informada, será hasheada automaticamente.',
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'ID do usuário',
      example: 1,
    }),
    ApiBody({
      type: UpdateUsuarioDto,
      description: 'Dados do usuário para atualização',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuário atualizado com sucesso',
      type: UsuarioEntity,
    }),
    ApiResponse({
      status: 400,
      description: 'Erro de validação nos dados fornecidos',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado - Token inválido ou expirado',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Permissões insuficientes',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário não encontrado',
    }),
    ApiBearerAuth(),
  )

export const RemoverUsuarioSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Remover usuário',
      description: 'Remove um usuário do sistema',
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'ID do usuário',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Usuário removido com sucesso',
      type: UsuarioEntity,
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado - Token inválido ou expirado',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Permissões insuficientes',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário não encontrado',
    }),
    ApiResponse({
      status: 409,
      description: 'Usuário não pode ser removido pois possui dependências',
    }),
    ApiBearerAuth(),
  )

export const BuscarEstatisticasSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Buscar estatísticas de usuários',
      description:
        'Retorna estatísticas detalhadas dos usuários por função, status, gênero e departamento',
    }),
    ApiResponse({
      status: 200,
      description: 'Estatísticas retornadas com sucesso',
      schema: {
        type: 'object',
        properties: {
          totalUsuarios: { type: 'number', example: 150 },
          usuariosAtivos: { type: 'number', example: 120 },
          usuariosInativos: { type: 'number', example: 30 },
          usuariosPorFuncao: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                funcao: { type: 'string', example: 'PARCEIRO' },
                total: { type: 'number', example: 45 },
              },
            },
          },
          usuariosPorStatus: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'ATIVO' },
                total: { type: 'number', example: 120 },
              },
            },
          },
          usuariosPorGenero: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                genero: { type: 'string', example: 'MASCULINO' },
                total: { type: 'number', example: 80 },
              },
            },
          },
          usuariosPorDepartamento: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                departamento: { type: 'string', example: 'SITE' },
                total: { type: 'number', example: 25 },
              },
            },
          },
          usuariosComEnderecos: { type: 'number', example: 90 },
          cadastrosRecentes: { type: 'number', example: 15 },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado - Token inválido ou expirado',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Permissões insuficientes',
    }),
    ApiBearerAuth(),
  )

export const AlterarSenhaSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Alterar senha do usuário',
      description:
        'Permite ao usuário alterar sua própria senha fornecendo a senha atual e a nova senha',
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'ID do usuário',
      example: 1,
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          senhaAtual: {
            type: 'string',
            description: 'Senha atual do usuário',
            example: 'SenhaAtual@123',
          },
          novaSenha: {
            type: 'string',
            description: 'Nova senha (deve seguir critérios de segurança)',
            example: 'NovaSenha@456',
          },
          confirmarSenha: {
            type: 'string',
            description: 'Confirmação da nova senha',
            example: 'NovaSenha@456',
          },
        },
        required: ['senhaAtual', 'novaSenha'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Senha alterada com sucesso',
      type: UsuarioEntity,
    }),
    ApiResponse({
      status: 400,
      description:
        'Erro de validação (senha atual incorreta ou nova senha inválida)',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado - Token inválido ou expirado',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Permissões insuficientes',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário não encontrado',
    }),
    ApiBearerAuth(),
  )

export const BuscarPermissoesUsuarioSwagger = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Listar permissões individuais do utilizador',
      description: 'Retorna todas as permissões individuais atribuídas diretamente ao utilizador por módulo',
    }),
    ApiParam({ name: 'id', type: 'number', description: 'ID do utilizador' }),
    ApiResponse({ status: 200, description: 'Lista de permissões retornada com sucesso' }),
    ApiResponse({ status: 404, description: 'Utilizador não encontrado' }),
    ApiResponse({ status: 401, description: 'Não autenticado' }),
    ApiResponse({ status: 403, description: 'Acesso negado' }),
  )

export const AtribuirPermissaoUsuarioSwagger = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Atribuir ou atualizar permissão individual do utilizador',
      description: 'Atribui ou atualiza a permissão de um utilizador para um módulo específico. Esta permissão tem prioridade sobre as permissões de grupo.',
    }),
    ApiParam({ name: 'id', type: 'number', description: 'ID do utilizador' }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['moduloId', 'nivel'],
        properties: {
          moduloId: { type: 'number', example: 1, description: 'ID do módulo' },
          nivel: {
            type: 'string',
            enum: ['NENHUM', 'LEITURA', 'ESCRITA', 'EXCLUSAO'],
            example: 'LEITURA',
            description: 'Nível de permissão: NENHUM (sem acesso), LEITURA (visualizar), ESCRITA (cadastrar/editar), EXCLUSAO (tudo incluindo excluir)',
          },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Permissão atribuída com sucesso' }),
    ApiResponse({ status: 404, description: 'Utilizador ou módulo não encontrado' }),
    ApiResponse({ status: 401, description: 'Não autenticado' }),
    ApiResponse({ status: 403, description: 'Acesso negado' }),
  )

export const RemoverPermissaoUsuarioSwagger = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Remover permissão individual do utilizador',
      description: 'Remove a permissão individual de um utilizador para um módulo específico',
    }),
    ApiParam({ name: 'id', type: 'number', description: 'ID do utilizador' }),
    ApiParam({ name: 'moduloId', type: 'number', description: 'ID do módulo' }),
    ApiResponse({ status: 200, description: 'Permissão removida com sucesso' }),
    ApiResponse({ status: 404, description: 'Permissão, utilizador ou módulo não encontrado' }),
    ApiResponse({ status: 401, description: 'Não autenticado' }),
    ApiResponse({ status: 403, description: 'Acesso negado' }),
  )
