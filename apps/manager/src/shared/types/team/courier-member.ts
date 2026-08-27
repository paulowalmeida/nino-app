import type { AuthUser } from '@shared/types/auth/auth-user'

export type CourierMember = {
  tenantId: string
  isActive: boolean
  createdAt: string
  courier: AuthUser
}
