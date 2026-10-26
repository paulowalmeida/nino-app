import type { MenuItem } from '@custom_types/menu/menu-item'
import type { SetStorefrontInteractionState } from '@pages/Storefront/types/SetStorefrontInteractionState.type'

export const setHomeCartOpen = (
  set: SetStorefrontInteractionState,
  open: boolean
) => set({ isCartOpen: open })
export const setHomeInfoOpen = (
  set: SetStorefrontInteractionState,
  open: boolean
) => set({ isInfoOpen: open })
export const setHomeSelectedItem = (
  set: SetStorefrontInteractionState,
  item: MenuItem | null
) => set({ selectedItem: item })
