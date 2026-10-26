import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

export const codeDefaultsMock: Pick<
  PromotionFormValues,
  'code' | 'showInMenu' | 'firstOrderOnly' | 'paymentMethods'
> = {
  code: '',
  showInMenu: true,
  firstOrderOnly: false,
  paymentMethods: [],
}
