import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

export const benefitDefaultsMock: Pick<
  PromotionFormValues,
  | 'campaignType'
  | 'giftProductId'
  | 'discountKind'
  | 'discountValue'
  | 'maxDiscount'
  | 'minOrderValue'
> = {
  campaignType: 'free-delivery',
  giftProductId: '',
  discountKind: 'PERCENTAGE_DISCOUNT',
  discountValue: '',
  maxDiscount: '',
  minOrderValue: '',
}
