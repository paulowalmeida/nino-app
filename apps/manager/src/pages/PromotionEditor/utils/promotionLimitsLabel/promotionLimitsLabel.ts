import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

export const promotionLimitsLabel = ({
  perCustomer,
  perCustomerCount,
  totalLimit,
}: Pick<
  PromotionFormValues,
  'perCustomer' | 'perCustomerCount' | 'totalLimit'
>): string => {
  const perCustomerLabel =
    perCustomer === 'once'
      ? '1 vez por cliente'
      : perCustomer === 'custom' && perCustomerCount !== ''
        ? `${perCustomerCount} vezes por cliente`
        : null
  const totalLabel =
    totalLimit !== '' && totalLimit > 0 ? `primeiros ${totalLimit} pedidos` : null
  return [perCustomerLabel, totalLabel].filter(Boolean).join(' · ') || 'Sem limite'
}
