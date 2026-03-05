import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedModulos() {
  const modulos = [
    { nome: 'usuarios', descricao: 'Gestão de utilizadores do sistema' },
    { nome: 'grupos-acesso', descricao: 'Gestão de grupos de acesso e permissões' },
    { nome: 'modulos', descricao: 'Gestão de módulos do sistema' },
    { nome: 'feed', descricao: 'Feed de publicações e interações sociais' },
    { nome: 'amizades', descricao: 'Gestão de amizades entre utilizadores' },
    { nome: 'conhecimento', descricao: 'Publicações de conhecimento e tutoriais' },
  ]

  console.log('🔐 Criando módulos do sistema...')

  for (const modulo of modulos) {
    await prisma.modulo.upsert({
      where: { nome: modulo.nome },
      update: { descricao: modulo.descricao },
      create: modulo,
    })
  }

  console.log(`✅ ${modulos.length} módulos criados/atualizados`)
}
