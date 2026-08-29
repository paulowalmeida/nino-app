import type { SetCheckoutState } from '@pages/checkout/types/SetCheckoutState.type'

export const setSlug = (set: SetCheckoutState, slug: string | undefined) =>
  set({ slug })
