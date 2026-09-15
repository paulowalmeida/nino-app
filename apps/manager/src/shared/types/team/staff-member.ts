import type { AuthUser } from '@shared/types/auth/auth-user'
import type { UnitRole } from '@shared/types/auth/unit-role'

export type StaffMember = {
  role: UnitRole
  user: AuthUser
}
