import { create } from 'zustand'

import { registerSessionClear } from '@shared/services/session/session-bridge'
import { clearSession } from '@shared/states/session/operations/clear-session/clear-session'
import { loadSession } from '@shared/states/session/operations/load-session/load-session'
import { setCurrentUnit } from '@shared/states/session/operations/set-current-unit/set-current-unit'
import { setSession } from '@shared/states/session/operations/set-session/set-session'
import type { SessionState } from '@shared/types/session/session-state'

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  memberships: [],
  currentUnitId: null,
  setSession: (user, memberships) => setSession(set, user, memberships),
  setCurrentUnit: (unitId) => setCurrentUnit(set, unitId),
  clear: () => clearSession(set),
  load: () => loadSession(get),
}))

registerSessionClear(() => useSessionStore.getState().clear())
