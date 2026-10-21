import { useEffect, useMemo, useState } from 'react'

import type { MenuSection } from '@shared/types/product/menu-section'
import { resolveApiAssetUrl } from '@shared/utils/api-asset-url/api-asset-url'

const pendingImages = new Map<string, Promise<boolean>>()

const preloadImage = (source: string) => {
  const pending = pendingImages.get(source)
  if (pending) return pending

  const promise = new Promise<boolean>((resolve) => {
    const image = new Image()
    let settled = false

    const settle = (loaded: boolean) => {
      if (settled) return
      settled = true
      resolve(loaded)
    }

    const settleAfterDecode = () => {
      if (!image.decode) {
        settle(true)
        return
      }

      void image
        .decode()
        .then(() => settle(true))
        .catch(() => settle(false))
    }

    image.onload = settleAfterDecode
    image.onerror = () => settle(false)
    image.src = source

    if (image.complete) {
      if (image.naturalWidth > 0) settleAfterDecode()
      else settle(false)
    }
  })

  pendingImages.set(source, promise)
  return promise
}

/**
 * The product grid must not swap its layout skeleton for photo placeholders.
 * It waits for every active product image to decode; unavailable files count
 * as ready because their card will render a neutral empty photo slot.
 */
export const useMenuImagesReady = (sections: MenuSection[]) => {
  const sources = useMemo(
    () => [
      ...new Set(
        sections
          .flatMap(({ items }) => items)
          .filter(({ isActive }) => isActive)
          .map(
            ({ images, fallbackUrl }) =>
              images?.[0]?.url ?? resolveApiAssetUrl(fallbackUrl)
          )
          .filter((source): source is string => Boolean(source))
      ),
    ],
    [sections]
  )
  const key = sources.join('\u001f')
  const [readiness, setReadiness] = useState<{
    key: string
    loadedSources: ReadonlySet<string>
  } | null>(null)

  useEffect(() => {
    if (sources.length === 0) return

    let active = true

    void Promise.all(
      sources.map(async (source) => ({
        source,
        loaded: await preloadImage(source),
      }))
    ).then((results) => {
      if (active) {
        setReadiness({
          key,
          loadedSources: new Set(
            results.filter(({ loaded }) => loaded).map(({ source }) => source)
          ),
        })
      }
    })

    return () => {
      active = false
    }
  }, [key, sources])

  return {
    areMenuImagesReady: sources.length === 0 || readiness?.key === key,
    loadedSources: readiness?.key === key ? readiness.loadedSources : null,
  }
}
