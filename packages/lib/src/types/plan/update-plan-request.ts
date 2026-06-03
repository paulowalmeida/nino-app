export type UpdatePlanRequest = {
  name?: string
  slug?: string
  typeId?: string
  price?: number
  maxTenants?: number
  maxProducts?: number
  maxOrders?: number
  isActive?: boolean
}
