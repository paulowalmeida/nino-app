import { PaginatedResponse } from './common'
import { User } from './user'

export interface CourierTenant {
  id: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  courier: User
  tenant: {
    id: string
    slug: string
    customName: string | null
    logoUrl: string | null
    city: string
    state: string
  }
}

export interface CreateCourierTenantRequest {
  courierId: string
  tenantId: string
}

export type CourierTenantPaginatedResponse = PaginatedResponse<CourierTenant>
