import type { SetProductChoicesState } from '@pages/Storefront/ProductDetail/types/SetProductChoicesState.type'

export const setChoiceQuantity = (
  set: SetProductChoicesState,
  quantity: number
) =>
  set((state) => ({
    // WHY: ao editar, zero é "tirar da sacola"; ao adicionar, o mínimo é 1.
    quantity: Math.max(state.editingLineId ? 0 : 1, quantity),
  }))

export const setChoiceNotes = (set: SetProductChoicesState, notes: string) =>
  set({ notes })
