import { create } from 'zustand'

import type { StorefrontInteractionState } from '@pages/Storefront/types/StorefrontInteractionState.type'
import {
  setHomeCartOpen,
  setHomeInfoOpen,
  setHomeSelectedItem,
} from './operations/visibility/visibility'
import { setHomeSearch } from './operations/search/search'

export const useHomeInteractionStore = create<StorefrontInteractionState>((set) => ({
  search: '',
  isCartOpen: false,
  isInfoOpen: false,
  selectedItem: null,
  setSearch: (search) => setHomeSearch(set, search),
  setCartOpen: (open) => setHomeCartOpen(set, open),
  setInfoOpen: (open) => setHomeInfoOpen(set, open),
  setSelectedItem: (item) => setHomeSelectedItem(set, item),
}))
