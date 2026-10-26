import type { SetProductChoicesState } from '@pages/Storefront/ProductDetail/types/SetProductChoicesState.type'

export const askReplacement = (set: SetProductChoicesState) =>
  set({ isReplacementPending: true })

export const dismissReplacement = (set: SetProductChoicesState) =>
  set({ isReplacementPending: false })
