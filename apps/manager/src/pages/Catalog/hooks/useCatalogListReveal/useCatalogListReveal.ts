import { useMemo, useState } from 'react'

import { CATALOG_PAGE_SIZE } from '@pages/Catalog/constants/catalog.constants'
import { useProductImagesReady } from '@shared/hooks/product/useProductImagesReady/useProductImagesReady'
import type { MenuItem } from '@shared/types/product/menu-item'
import { resolveApiAssetUrl } from '@shared/utils/api-asset-url/api-asset-url'

/**
 * WHY: only the first page gates the reveal. Gating on every loaded item
 * would send the whole screen back to the skeleton on each infinite-scroll
 * page.
 */
export const useCatalogListReveal = (
  items: MenuItem[],
  isListLoaded: boolean,
  isPlaceholderData: boolean
) => {
  const firstPageItems = useMemo(
    () => items.slice(0, CATALOG_PAGE_SIZE),
    [items]
  )
  const { areImagesReady, loadedSources } =
    useProductImagesReady(firstPageItems)
  const [hasRevealed, setHasRevealed] = useState(false)
  const isCurrentListReady =
    isListLoaded && !isPlaceholderData && areImagesReady

  if (!hasRevealed && isCurrentListReady) setHasRevealed(true)

  const preloadedImageItemIds = useMemo(
    () =>
      new Set(
        firstPageItems
          .filter(({ images, fallbackUrl }) =>
            loadedSources.has(
              images?.[0]?.url ?? resolveApiAssetUrl(fallbackUrl) ?? ''
            )
          )
          .map(({ id }) => id)
      ),
    [firstPageItems, loadedSources]
  )

  return {
    isFirstRevealPending: !hasRevealed && !isCurrentListReady,
    isListSwitching: hasRevealed && !isCurrentListReady,
    preloadedImageItemIds,
  }
}
