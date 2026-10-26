import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'

export const setSheet = (set: SetCounterState, sheet: boolean) => set({ sheet })
