import { invalidatePendingSessionLoad } from '@shared/states/session/operations/load-session/load-session'
import type { SetSession } from '@shared/types/session/set-session'

export const clearSession = (set: SetSession) => {
  invalidatePendingSessionLoad()
  set({ user: null, memberships: [], currentUnitId: null })
}
