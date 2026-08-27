import type { SetNewOrderState } from '@pages/NewOrder/types/SetNewOrderState.type'

export const setNotes = (set: SetNewOrderState, notes: string) => set({ notes })
