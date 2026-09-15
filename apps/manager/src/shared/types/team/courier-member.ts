import type { AuthUser } from '@shared/types/auth/auth-user'

export type CourierMember = {
  unitId: string
  isActive: boolean
  createdAt: string
  courier: AuthUser
}
