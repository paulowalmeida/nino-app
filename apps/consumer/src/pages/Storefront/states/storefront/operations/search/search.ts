import type { SetStorefrontInteractionState } from '@pages/Storefront/types/SetStorefrontInteractionState.type'

export const setHomeSearch = (
  set: SetStorefrontInteractionState,
  search: string
) => set({ search })

/** Fechar a busca leva o termo junto: ele não pode sobrar de uma busca já encerrada. */
export const setHomeSearchOpen = (
  set: SetStorefrontInteractionState,
  open: boolean
) => set(open ? { isSearchOpen: true } : { isSearchOpen: false, search: '' })
