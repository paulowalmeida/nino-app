import { create } from 'zustand'

import type { AuthUser, Membership } from '@custom_types/auth'
import { AuthService } from '@services/auth.service'
import { forgetSession, rememberSession } from '@utils/session-hint'

type SessionState = {
  user: AuthUser | null
  memberships: Membership[]
  currentTenantId: string | null
  setSession: (user: AuthUser, memberships: Membership[]) => void
  setCurrentTenant: (tenantId: string | null) => void
  clear: () => void
  load: () => Promise<AuthUser | null>
}

const EMPTY: Pick<SessionState, 'user' | 'memberships' | 'currentTenantId'> = {
  user: null,
  memberships: [],
  currentTenantId: null,
}

export const useSessionStore = create<SessionState>((set, get) => ({
  ...EMPTY,
  setSession: (user, memberships) => set({ user, memberships }),
  setCurrentTenant: (currentTenantId) => set({ currentTenantId }),
  clear: () => set(EMPTY),
  load: async () => {
    const { user, setSession } = get()
    if (user) return user

    try {
      const { memberships, ...fetched } = await AuthService.me()
      setSession(fetched, memberships)
      rememberSession()
      return fetched
    } catch {
      forgetSession()
      return null
    }
  },
}))
