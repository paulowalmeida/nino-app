import { lastOrderLabel } from '@pages/CustomerDetail/utils/order-recency'

const monthYear = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  year: 'numeric',
})

export const customerCadenceLabel = (
  since: string,
  lastOrderAt: string | null
): string =>
  `Cliente desde ${monthYear.format(new Date(since))}` +
  ` · ${lastOrderLabel(lastOrderAt)}`
