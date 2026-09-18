import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'

export const clearLastSale = (set: SetCounterState) => set({ lastSale: null })
