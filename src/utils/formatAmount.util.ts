export function formatAmount(amount: number) {
  const adjustedAmount = amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return parseFloat(adjustedAmount)
}
