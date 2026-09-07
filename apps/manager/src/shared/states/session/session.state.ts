import { create } from 'zustand'

import type { SessionState } from '@shared/types/session/session-state'

import { clearSession } from './operations/clear-session/clear-session'
import { loadSession } from './operations/load-session/load-session'
import { setCurrentTenant } from './operations/set-current-tenant/set-current-tenant'
import { setSession } from './operations/set-session/set-session'


export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  memberships: [],
  currentTenantId: null,
  setSession: (user, memberships) => setSession(set, user, memberships),
  setCurrentTenant: (tenantId) => setCurrentTenant(set, tenantId),
  clear: () => clearSession(set),
  load: () => loadSession(get),
}))
