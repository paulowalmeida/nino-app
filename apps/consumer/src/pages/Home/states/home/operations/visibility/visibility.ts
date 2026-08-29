import type { MenuItem } from '@custom_types/menu/menu-item'
import type { SetHomeInteractionState } from '@pages/Home/types/SetHomeInteractionState.type'

export const setHomeCartOpen = (set: SetHomeInteractionState, open: boolean) =>
  set({ isCartOpen: open })
export const setHomeInfoOpen = (set: SetHomeInteractionState, open: boolean) =>
  set({ isInfoOpen: open })
export const setHomeSelectedItem = (
  set: SetHomeInteractionState,
  item: MenuItem | null
) => set({ selectedItem: item })
