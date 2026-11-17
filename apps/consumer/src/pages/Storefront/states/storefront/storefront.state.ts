import { create } from 'zustand'

import type { StorefrontInteractionState } from '@pages/Storefront/types/StorefrontInteractionState.type'
import {
  setHomeCartOpen,
  setHomeCouponsOpen,
  setHomeFocusedPromotion,
  setHomeInfoOpen,
  setHomeSelectedItem,
} from './operations/visibility/visibility'
import { setHomeSearch, setHomeSearchOpen } from './operations/search/search'

export const useHomeInteractionStore = create<StorefrontInteractionState>(
  (set) => ({
    search: '',
    isSearchOpen: false,
    isCartOpen: false,
    isInfoOpen: false,
    selectedItem: null,
    focusedPromotionId: null,
    isCouponsOpen: false,
    setSearch: (search) => setHomeSearch(set, search),
    setSearchOpen: (open) => setHomeSearchOpen(set, open),
    setCartOpen: (open) => setHomeCartOpen(set, open),
    setInfoOpen: (open) => setHomeInfoOpen(set, open),
    setSelectedItem: (item) => setHomeSelectedItem(set, item),
    setFocusedPromotionId: (id) => setHomeFocusedPromotion(set, id),
    setCouponsOpen: (open) => setHomeCouponsOpen(set, open),
    reset: () =>
      set({
        search: '',
        isSearchOpen: false,
        isCartOpen: false,
        isInfoOpen: false,
        selectedItem: null,
        focusedPromotionId: null,
        isCouponsOpen: false,
      }),
  })
)
