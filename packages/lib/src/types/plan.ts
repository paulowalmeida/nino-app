import { PlanType } from '../enums'
import { PaginatedResponse } from './common'

export interface PlanRecord {
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

export interface CreatePlanRequest {
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

export interface UpdatePlanRequest {
  name?: string
  slug?: string
  typeId?: string
  price?: number
  maxTenants?: number
  maxProducts?: number
  maxOrders?: number
  isActive?: boolean
}

export interface PlanPaginatedResponse extends PaginatedResponse<PlanRecord> {}
