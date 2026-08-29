import type { MenuItem } from '@custom_types/menu/menu-item'

export type HomeInteractionState = {
  search: string
  isCartOpen: boolean
  isInfoOpen: boolean
  selectedItem: MenuItem | null
  setSearch: (search: string) => void
  setCartOpen: (open: boolean) => void
  setInfoOpen: (open: boolean) => void
  setSelectedItem: (item: MenuItem | null) => void
}
