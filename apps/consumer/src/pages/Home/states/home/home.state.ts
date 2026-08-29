import { create } from 'zustand'

import type { HomeInteractionState } from '@pages/Home/types/HomeInteractionState.type'
import { setHomeCartOpen, setHomeInfoOpen, setHomeSelectedItem } from './operations/visibility/visibility'
import { setHomeSearch } from './operations/search/search'

export const useHomeInteractionStore = create<HomeInteractionState>((set) => ({
  search: '',
  isCartOpen: false,
  isInfoOpen: false,
  selectedItem: null,
  setSearch: (search) => setHomeSearch(set, search),
  setCartOpen: (open) => setHomeCartOpen(set, open),
  setInfoOpen: (open) => setHomeInfoOpen(set, open),
  setSelectedItem: (item) => setHomeSelectedItem(set, item),
}))
