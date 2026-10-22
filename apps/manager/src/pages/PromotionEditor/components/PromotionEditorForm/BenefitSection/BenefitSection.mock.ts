import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

export const benefitDefaultsMock: Pick<
  PromotionFormValues,
  | 'campaignType'
  | 'discountKind'
  | 'discountValue'
  | 'maxDiscount'
  | 'minOrderValue'
> = {
  campaignType: 'free-delivery',
  discountKind: 'PERCENTAGE_DISCOUNT',
  discountValue: '',
  maxDiscount: '',
  minOrderValue: '',
}
