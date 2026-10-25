import type { SetStorefrontInteractionState } from '@pages/Storefront/types/SetStorefrontInteractionState.type'

export const setHomeSearch = (
  set: SetStorefrontInteractionState,
  search: string
) => set({ search })
