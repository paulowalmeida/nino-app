import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'

export const setTableNumber = (set: SetCounterState, table: string) =>
  set({ tableNumber: table })
