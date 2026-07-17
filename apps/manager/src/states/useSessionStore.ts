import { create } from 'zustand'

import type { SessionState } from '@custom_types/session'

const EMPTY: Pick<SessionState, 'user' | 'memberships' | 'currentTenantId'> = {
  user: null,
  memberships: [],
  currentTenantId: null,
}

/**
 * Merchant session: who is logged in, which stores they can open and which one
 * is active. Server data (orders, products, zones) never lands here — that is
 * TanStack Query's territory.
 */
export const useSessionStore = create<SessionState>((set) => ({
  ...EMPTY,
  setSession: (user, memberships) => set({ user, memberships }),
  setCurrentTenant: (currentTenantId) => set({ currentTenantId }),
  clear: () => set(EMPTY),
}))
