import type { Promotion } from '@shared/types/marketing/promotion.type'

const shortDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
})

export const campaignCreatedAt = ({ createdAt }: Pick<Promotion, 'createdAt'>) =>
  shortDate.format(new Date(createdAt))
