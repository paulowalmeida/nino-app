import type { AuthUser } from '@shared/types/auth/auth-user'
import type { UnitRole } from '@shared/types/auth/unit-role'
import type { StaffPosition } from '@shared/types/team/staff-position.type'

export type StaffMember = {
  role: UnitRole
  position: StaffPosition
  user: AuthUser
}
