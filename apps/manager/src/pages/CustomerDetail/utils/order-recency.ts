const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

/**
 * Há quanto tempo esta pessoa não pede. Conta em dias porque a janela do
 * histórico é de 90 — passou disso, o número exato não muda a decisão de
 * quem está olhando a ficha. Sai em minúscula: a frase sempre entra depois
 * de "Cliente desde ...".
 */
export const lastOrderLabel = (iso: string | null): string => {
  if (!iso) return 'ainda sem pedido aqui'

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'ainda sem pedido aqui'

  const days = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86_400_000
  )

  if (days <= 0) return 'pediu hoje'
  if (days === 1) return 'pediu ontem'

  return `último pedido há ${days} dias`
}
