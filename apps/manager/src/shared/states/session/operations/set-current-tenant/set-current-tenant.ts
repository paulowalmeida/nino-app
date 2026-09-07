import type { SetSession } from '@shared/types/session/set-session'

export const setCurrentTenant = (
  set: SetSession,
  currentTenantId: string | null
) => set({ currentTenantId })
