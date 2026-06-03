import { PlanType } from '../../enums'

export type PlanRecord = {
  id: string
  name: string
  slug: string
  price: number
  maxTenants: number
  maxProducts: number
  maxOrders: number
  hasPrioritySupport: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  type: { name: PlanType }
}
