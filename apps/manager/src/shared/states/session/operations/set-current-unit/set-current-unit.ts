import type { SetSession } from '@shared/types/session/set-session'

export const setCurrentUnit = (
  set: SetSession,
  currentUnitId: string | null
) => set({ currentUnitId })
