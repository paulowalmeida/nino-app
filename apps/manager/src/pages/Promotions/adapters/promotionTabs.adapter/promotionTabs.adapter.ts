import type { PromotionTab } from '@pages/Promotions/types/PromotionTab.type'
import type { Promotion } from '@shared/types/marketing/promotion.type'
import { promotionSummaryParts } from '@shared/utils/promotion-summary/promotion-summary'

const tabOf = ({ state }: Promotion): PromotionTab =>
  state === 'ACTIVE' ? 'active' : state === 'SCHEDULED' ? 'scheduled' : 'inactive'

const matches = (promotion: Promotion, query: string): boolean =>
  [promotion.name, promotion.code, promotionSummaryParts(promotion).headline]
    .filter(Boolean)
    .some((text) => text?.toLowerCase().includes(query))

export const toPromotionTabs = (
  promotions: Promotion[] = [],
  term = ''
): Record<PromotionTab, Promotion[]> => {
  const query = term.trim().toLowerCase()
  const tabs: Record<PromotionTab, Promotion[]> = {
    active: [],
    scheduled: [],
    inactive: [],
  }
  for (const promotion of promotions) {
    if (!query || matches(promotion, query)) tabs[tabOf(promotion)].push(promotion)
  }
  return tabs
}
