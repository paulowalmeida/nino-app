import type { SetSession } from '../../session.state'

export const clearSession = (set: SetSession) =>
  set({ user: null, memberships: [], currentTenantId: null })
