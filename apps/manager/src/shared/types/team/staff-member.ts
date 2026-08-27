import type { AuthUser } from '@shared/types/auth/auth-user'
import type { TenantRole } from '@shared/types/auth/tenant-role'

export type StaffMember = {
  role: TenantRole
  user: AuthUser
}
