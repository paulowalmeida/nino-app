import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

export const limitsDefaultsMock: Pick<
  PromotionFormValues,
  'perCustomer' | 'perCustomerCount' | 'totalLimit'
> = {
  perCustomer: 'unlimited',
  perCustomerCount: '',
  totalLimit: '',
}
