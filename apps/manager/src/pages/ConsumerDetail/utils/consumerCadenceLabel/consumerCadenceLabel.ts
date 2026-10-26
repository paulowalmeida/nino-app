import { lastOrderLabel } from '@pages/ConsumerDetail/utils/order-recency'

const monthYear = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  year: 'numeric',
})

export const consumerCadenceLabel = (
  since: string,
  lastOrderAt: string | null
): string =>
  `Cliente desde ${monthYear.format(new Date(since))}` +
  ` · ${lastOrderLabel(lastOrderAt)}`
