export type PromotionListQuery = {
  tab: 'active' | 'scheduled' | 'inactive'
  search: string
  target: 'createdAt' | 'createdBy' | 'usageCount'
  direction: 'asc' | 'desc'
  page: number
  size: number
}
