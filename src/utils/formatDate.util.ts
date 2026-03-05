export function formatDate(dateMain: Date) {
  const data = new Date(dateMain)

  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = data.getFullYear()

  const dataFormatada = `${dia}/${mes}/${ano}`

  return dataFormatada
}
