import * as bcrypt from 'bcrypt'

export async function generatePassword(
  length: number = 8,
): Promise<{ senha: string; hash: string }> {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const special = '!@#$%^&*()-_=+[]{}|;:,.<>/?'

  // Garantir pelo menos 1 de cada
  const requiredChars = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    special[Math.floor(Math.random() * special.length)],
  ]

  // Todos os caracteres possíveis
  const allChars = upper + lower + numbers + special

  // Completa até o tamanho desejado
  for (let i = requiredChars.length; i < length; i++) {
    requiredChars.push(allChars[Math.floor(Math.random() * allChars.length)])
  }

  // Embaralhar a senha
  const senha = requiredChars.sort(() => Math.random() - 0.5).join('')

  // Gerar hash
  const salt = await bcrypt.genSalt()
  const hash = await bcrypt.hash(senha, salt)

  return { senha, hash }
}
