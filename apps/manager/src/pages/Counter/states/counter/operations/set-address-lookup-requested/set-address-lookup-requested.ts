import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'

export const setAddressLookupRequested = (
  set: SetCounterState,
  requested: boolean
) => set({ addressLookupRequested: requested })
