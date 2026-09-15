import type { AuthUser } from '@shared/types/auth/auth-user'
import type { Membership } from '@shared/types/auth/membership'

export type SessionState = {
  user: AuthUser | null
  memberships: Membership[]
  currentUnitId: string | null
  setSession: (user: AuthUser, memberships: Membership[]) => void
  setCurrentUnit: (unitId: string | null) => void
  clear: () => void
  load: () => Promise<AuthUser | null>
}
