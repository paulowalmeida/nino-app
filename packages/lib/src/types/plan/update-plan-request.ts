export type UpdatePlanRequest = {
  name?: string
  slug?: string
  typeId?: string
  price?: number
  maxUnits?: number
  maxProducts?: number
  maxOrders?: number
  isActive?: boolean
}
