import { CAMPAIGN_TYPE_OPTIONS } from '@pages/PromotionEditor/constants/promotionEditor.constants'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'

const shortDate = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
})

// WHY: o nome da promoção aparece para o cliente no card; tipo + data não serve.
export const campaignDefaultName = (
  campaignType: PromotionFormValues['campaignType'],
  now: Date
): string => {
  if (campaignType === 'package') return ''
  const label =
    CAMPAIGN_TYPE_OPTIONS.find(({ value }) => value === campaignType)?.label ??
    ''
  return `${label} - ${shortDate.format(now)}`
}
