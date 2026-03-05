import {
  Departamento,
  Genero,
  PrismaClient,
  UsuarioFuncao,
  UsuarioStatus,
} from '@prisma/client'
import { usuariosMock } from '../mocks/usuarios'

const prisma = new PrismaClient()

export async function seedUsuarios() {
  console.log('👤 Criando usuários...')

  for (const usuario of usuariosMock) {
    try {
      await prisma.usuario.upsert({
        where: { email: usuario.email },
        update: { senha: usuario.senha },
        create: {
          nome: usuario.nome,
          email: usuario.email,
          senha: usuario.senha,
          telefone: usuario.telefone,
          documento: usuario.documento,
          aniversario: usuario.aniversario,
          genero: usuario.genero as Genero,
          observacao: usuario.observacao,
          foto: usuario.foto,
          ativo: usuario.ativo,
          verificado: usuario.verificado,
          status: usuario.status as UsuarioStatus,
          funcao: usuario.funcao as UsuarioFuncao,
          departamento: usuario.departamento as Departamento,
          createdAt: usuario.createdAt,
          updatedAt: usuario.updatedAt,
        },
      })
    } catch (error) {
      console.error(`Erro ao inserir usuário ${usuario.email}:`, error)
    }
  }

  console.log(`✅ ${usuariosMock.length} usuários criados/atualizados`)
}
