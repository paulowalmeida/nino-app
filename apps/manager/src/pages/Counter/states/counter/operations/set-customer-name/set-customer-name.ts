import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'

export const setCustomerName = (set: SetCounterState, name: string) =>
  set({ customerName: name })
