import { PrismaClient } from '@prisma/client'
import { publicacoesComentariosMock } from '../mocks/publicacoesComentarios'

const prisma = new PrismaClient()

export async function seedPublicacoesComentarios() {
  console.log('💬 Criando comentários...')

  for (const comentario of publicacoesComentariosMock) {
    try {
      await prisma.publicacaoComentario.upsert({
        where: { id: comentario.id },
        update: {},
        create: {
          publicacaoId: comentario.publicacaoId,
          autorId: comentario.autorId,
          conteudo: comentario.conteudo,
          ativo: comentario.ativo,
          createdAt: comentario.createdAt,
          updatedAt: comentario.updatedAt,
        },
      })
    } catch (error) {
      console.error(`Erro ao inserir comentário ${comentario.id}:`, error)
    }
  }

  console.log(`✅ ${publicacoesComentariosMock.length} comentários criados/atualizados`)
}
