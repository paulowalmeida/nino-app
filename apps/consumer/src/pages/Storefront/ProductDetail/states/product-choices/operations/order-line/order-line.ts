import type { SetProductChoicesState } from '@pages/Storefront/ProductDetail/types/SetProductChoicesState.type'

export const setChoiceQuantity = (
  set: SetProductChoicesState,
  quantity: number
) => set({ quantity: Math.max(1, quantity) })

export const setChoiceNotes = (set: SetProductChoicesState, notes: string) =>
  set({ notes })
