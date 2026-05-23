import { GlobalRole, TenantRole } from '../enums'
import { PaginatedResponse, PaginatedQuery } from './common'

export interface CredentialInfo {
  id: string
  userId: string
  email: string | null
  provider: string
  providerCode: string | null
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  phone: string | null
  isActive: boolean
  lastLoginAt: string | null
  locale: string | null
  timezone: string | null
  companyId: string | null
  createdAt: string
  updatedAt: string
  role: { id: string; name: GlobalRole }
  credentials: CredentialInfo[]
}

export interface CreateUserRequest {
  name: string
  phone?: string
  globalRoleId: string
  isActive?: boolean
  locale?: string
  timezone?: string
}

export interface UpdateUserRequest {
  name?: string
  phone?: string
  globalRoleId?: string
  isActive?: boolean
  locale?: string
  timezone?: string
  lastLoginAt?: string
}

export interface UserQuery extends PaginatedQuery {
  companyId?: string
}

export type UserPaginatedResponse = PaginatedResponse<User>

export interface UserTenant {
  id: string
  tenantId: string
  createdAt: string
  updatedAt: string
  tenantRole: { id: string; name: TenantRole }
  user: User
}

export interface CreateUserTenantRequest {
  userId: string
  tenantId: string
  tenantRoleId: string
}

export type UserTenantPaginatedResponse = PaginatedResponse<UserTenant>
