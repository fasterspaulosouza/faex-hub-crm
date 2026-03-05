import { seedModulos } from './seeds/modulos.seed'
import { seedUsuarios } from './seeds/usuarios.seed'
import { seedAmizades } from './seeds/amizades.seed'
import { seedPublicacoes } from './seeds/publicacoes.seed'
import { seedPublicacoesComentarios } from './seeds/publicacoesComentarios.seed'
import { seedPublicacoesCurtidas } from './seeds/publicacoesCurtidas.seed'
import { seedPublicacoesConhecimento } from './seeds/publicacoesConhecimento.seed'

async function main() {
  await seedModulos()
  await seedUsuarios()
  await seedAmizades()
  await seedPublicacoes()
  await seedPublicacoesComentarios()
  await seedPublicacoesCurtidas()
  await seedPublicacoesConhecimento()
}

main()
  .then(() => console.log('✅ Todos os seeds foram executados com sucesso!'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
