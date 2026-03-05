import { PrismaClient, PublicacaoTipo, Visibilidade } from '@prisma/client'
import { publicacoesMock } from '../mocks/publicacoes'

const prisma = new PrismaClient()

export async function seedPublicacoes() {
  console.log('📝 Criando publicações...')

  for (const publicacao of publicacoesMock) {
    try {
      await prisma.publicacao.upsert({
        where: { id: publicacao.id },
        update: {},
        create: {
          autorId: publicacao.autorId,
          tipo: publicacao.tipo as PublicacaoTipo,
          conteudo: publicacao.conteudo,
          midia: publicacao.midia,
          visibilidade: publicacao.visibilidade as Visibilidade,
          ativo: publicacao.ativo,
          createdAt: publicacao.createdAt,
          updatedAt: publicacao.updatedAt,
        },
      })
    } catch (error) {
      console.error(`Erro ao inserir publicação ${publicacao.id}:`, error)
    }
  }

  console.log(`✅ ${publicacoesMock.length} publicações criadas/atualizadas`)
}
