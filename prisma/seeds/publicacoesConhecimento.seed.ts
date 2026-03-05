import { PrismaClient, VisibilidadeConhecimento } from '@prisma/client'
import { publicacoesConhecimentoMock } from '../mocks/publicacoesConhecimento'

const prisma = new PrismaClient()

export async function seedPublicacoesConhecimento() {
  console.log('🎓 Criando publicações de conhecimento...')

  for (const conhecimento of publicacoesConhecimentoMock) {
    try {
      await prisma.publicacaoConhecimento.upsert({
        where: { id: conhecimento.id },
        update: {},
        create: {
          autorId: conhecimento.autorId,
          titulo: conhecimento.titulo,
          descricao: conhecimento.descricao,
          urlYoutube: conhecimento.urlYoutube,
          visibilidade: conhecimento.visibilidade as VisibilidadeConhecimento,
          ativo: conhecimento.ativo,
          createdAt: conhecimento.createdAt,
          updatedAt: conhecimento.updatedAt,
        },
      })
    } catch (error) {
      console.error(`Erro ao inserir conhecimento ${conhecimento.id}:`, error)
    }
  }

  console.log(`✅ ${publicacoesConhecimentoMock.length} publicações de conhecimento criadas/atualizadas`)
}
