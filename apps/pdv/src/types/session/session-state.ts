import type { AuthUser, Membership } from '@custom_types/auth'

export type SessionState = {
  user: AuthUser | null
  memberships: Membership[]
  currentTenantId: string | null
  setSession: (user: AuthUser, memberships: Membership[]) => void
  setCurrentTenant: (tenantId: string | null) => void
  clear: () => void
}
