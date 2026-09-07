import type { SetSession } from '@shared/types/session/set-session'

export const clearSession = (set: SetSession) =>
  set({ user: null, memberships: [], currentTenantId: null })
