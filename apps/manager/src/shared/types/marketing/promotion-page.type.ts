import type { Promotion } from './promotion.type'
import type { PromotionListQuery } from './promotion-list-query.type'

export type PromotionPage = {
  data: Promotion[]
  pagination: { page: number; size: number; total: number; totalPages: number }
  tabCounts: Record<PromotionListQuery['tab'], number>
}
