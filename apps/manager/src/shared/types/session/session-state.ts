import type { AuthUser } from '@shared/types/auth/auth-user'
import type { Membership } from '@shared/types/auth/membership'

export type SessionState = {
  user: AuthUser | null
  memberships: Membership[]
  currentTenantId: string | null
  setSession: (user: AuthUser, memberships: Membership[]) => void
  setCurrentTenant: (tenantId: string | null) => void
  clear: () => void
  load: () => Promise<AuthUser | null>
}

export type SetSession = (partial: Partial<SessionState>) => void
export type GetSession = () => SessionState
