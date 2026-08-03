import { create } from 'zustand'

import type { SessionState } from '@custom_types/session'

const EMPTY: Pick<SessionState, 'user' | 'memberships' | 'currentTenantId'> = {
  user: null,
  memberships: [],
  currentTenantId: null,
}

export const useSessionStore = create<SessionState>((set) => ({
  ...EMPTY,
  setSession: (user, memberships) => set({ user, memberships }),
  setCurrentTenant: (currentTenantId) => set({ currentTenantId }),
  clear: () => set(EMPTY),
}))
