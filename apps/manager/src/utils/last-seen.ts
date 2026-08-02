const time = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

const dayMonth = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
})

const fullDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

/**
 * Quando a pessoa entrou no painel pela última vez, na régua de quem
 * administra a loja: hoje e ontem têm nome, o resto do ano é dia e mês, e o
 * ano anterior aparece inteiro. A hora acompanha até uma semana atrás —
 * depois disso o horário exato não diz mais nada, só a distância.
 *
 * Conta que nunca entrou não é "—": é justamente o caso que interessa a quem
 * está revendo quem ainda precisa de acesso.
 */
export const lastSeenLabel = (iso: string | null): string => {
  if (!iso) return 'Nunca entrou'

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Nunca entrou'

  const now = new Date()
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000)

  if (days <= 0) return `Hoje às ${time.format(date)}`
  if (days === 1) return `Ontem às ${time.format(date)}`
  if (days < 7) return `${dayMonth.format(date)} às ${time.format(date)}`

  return date.getFullYear() === now.getFullYear()
    ? dayMonth.format(date)
    : fullDate.format(date)
}
