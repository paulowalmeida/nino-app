export type CreatePlanRequest = {
  name: string
  slug: string
  typeId: string
  price: number
  maxTenants: number
  maxProducts: number
  maxOrders: number
  hasPrioritySupport?: boolean
  isActive?: boolean
}
