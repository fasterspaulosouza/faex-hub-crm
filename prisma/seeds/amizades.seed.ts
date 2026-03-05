import { AmizadeStatus, PrismaClient } from '@prisma/client'
import { amizadesMock } from '../mocks/amizades'

const prisma = new PrismaClient()

export async function seedAmizades() {
  console.log('🤝 Criando amizades...')

  for (const amizade of amizadesMock) {
    try {
      await prisma.amizade.upsert({
        where: {
          solicitanteId_receptorId: {
            solicitanteId: amizade.solicitanteId,
            receptorId: amizade.receptorId,
          },
        },
        update: {},
        create: {
          solicitanteId: amizade.solicitanteId,
          receptorId: amizade.receptorId,
          status: amizade.status as AmizadeStatus,
          createdAt: amizade.createdAt,
          updatedAt: amizade.updatedAt,
        },
      })
    } catch (error) {
      console.error(`Erro ao inserir amizade ${amizade.solicitanteId}->${amizade.receptorId}:`, error)
    }
  }

  console.log(`✅ ${amizadesMock.length} amizades criadas/atualizadas`)
}
