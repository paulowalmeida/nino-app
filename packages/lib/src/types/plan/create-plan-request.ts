export type CreatePlanRequest = {
  name: string
  slug: string
  typeId: string
  price: number
  maxUnits: number
  maxProducts: number
  maxOrders: number
  hasPrioritySupport?: boolean
  isActive?: boolean
}
