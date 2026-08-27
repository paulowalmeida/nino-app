import type { SetSession } from '../../session.state'

export const setCurrentTenant = (
  set: SetSession,
  currentTenantId: string | null
) => set({ currentTenantId })
