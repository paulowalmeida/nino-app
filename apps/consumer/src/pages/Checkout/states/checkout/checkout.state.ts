import { create } from 'zustand'

import { setSlug } from '@pages/checkout/states/slug/slug'
import type { CheckoutState } from '@pages/checkout/types/CheckoutState.type'

export const useCheckoutStore = create<CheckoutState>((set) => ({
  slug: undefined,
  setSlug: (slug) => setSlug(set, slug),
}))
