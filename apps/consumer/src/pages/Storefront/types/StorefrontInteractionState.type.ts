import type { MenuItem } from '@custom_types/menu/menu-item'

export type StorefrontInteractionState = {
  search: string
  isSearchOpen: boolean
  isCartOpen: boolean
  isInfoOpen: boolean
  selectedItem: MenuItem | null
  focusedPromotionId: string | null
  setSearch: (search: string) => void
  setSearchOpen: (open: boolean) => void
  setCartOpen: (open: boolean) => void
  setInfoOpen: (open: boolean) => void
  setSelectedItem: (item: MenuItem | null) => void
  setFocusedPromotionId: (id: string | null) => void
  reset: () => void
}
