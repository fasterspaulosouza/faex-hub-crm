import { PrismaClient } from '@prisma/client'
import { publicacoesCurtidasMock } from '../mocks/publicacoesCurtidas'

const prisma = new PrismaClient()

export async function seedPublicacoesCurtidas() {
  console.log('❤️  Criando curtidas...')

  for (const curtida of publicacoesCurtidasMock) {
    try {
      await prisma.publicacaoCurtida.upsert({
        where: {
          publicacaoId_usuarioId: {
            publicacaoId: curtida.publicacaoId,
            usuarioId: curtida.usuarioId,
          },
        },
        update: {},
        create: {
          publicacaoId: curtida.publicacaoId,
          usuarioId: curtida.usuarioId,
          createdAt: curtida.createdAt,
        },
      })
    } catch (error) {
      console.error(`Erro ao inserir curtida ${curtida.publicacaoId}->${curtida.usuarioId}:`, error)
    }
  }

  console.log(`✅ ${publicacoesCurtidasMock.length} curtidas criadas/atualizadas`)
}
