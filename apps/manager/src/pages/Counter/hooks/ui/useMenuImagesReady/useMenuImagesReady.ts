import { useMemo } from 'react'

import { useProductImagesReady } from '@shared/hooks/product/useProductImagesReady/useProductImagesReady'
import type { MenuSection } from '@shared/types/product/menu-section'

/**
 * The product grid must not swap its layout skeleton for photo placeholders.
 * It waits for every active product image to decode; unavailable files count
 * as ready because their card will render a neutral empty photo slot.
 */
export const useMenuImagesReady = (sections: MenuSection[]) => {
  const activeItems = useMemo(
    () =>
      sections
        .flatMap(({ items }) => items)
        .filter(({ isActive }) => isActive),
    [sections]
  )
  const { areImagesReady, loadedSources } = useProductImagesReady(activeItems)

  return {
    areMenuImagesReady: areImagesReady,
    loadedSources,
  }
}
