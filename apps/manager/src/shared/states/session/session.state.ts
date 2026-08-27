import { create } from 'zustand'

import type { AuthUser } from '@shared/types/auth/auth-user'
import type { Membership } from '@shared/types/auth/membership'

import { clearSession } from './operations/clear-session/clear-session'
import { loadSession } from './operations/load-session/load-session'
import { setCurrentTenant } from './operations/set-current-tenant/set-current-tenant'
import { setSession } from './operations/set-session/set-session'

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

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  memberships: [],
  currentTenantId: null,
  setSession: (user, memberships) => setSession(set, user, memberships),
  setCurrentTenant: (tenantId) => setCurrentTenant(set, tenantId),
  clear: () => clearSession(set),
  load: () => loadSession(get),
}))
