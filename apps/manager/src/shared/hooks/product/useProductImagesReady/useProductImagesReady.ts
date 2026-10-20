import { useEffect, useMemo, useState } from 'react'

import type { MenuItem } from '@shared/types/product/menu-item'
import { resolveApiAssetUrl } from '@shared/utils/api-asset-url/api-asset-url'

const pendingImages = new Map<string, Promise<void>>()

const preloadImage = (source: string) => {
  const pending = pendingImages.get(source)
  if (pending) return pending

  const promise = new Promise<void>((resolve) => {
    const image = new Image()
    let settled = false

    const settle = () => {
      if (settled) return
      settled = true
      resolve()
    }
    const settleAfterDecode = () => {
      if (!image.decode) return settle()
      void image
        .decode()
        .catch(() => undefined)
        .finally(settle)
    }

    image.onload = settleAfterDecode
    image.onerror = settle
    image.src = source

    if (image.complete) {
      if (image.naturalWidth > 0) settleAfterDecode()
      else settle()
    }
  })

  pendingImages.set(source, promise)
  return promise
}

/** Keeps a list skeleton visible until every rendered product photo decodes. */
export const useProductImagesReady = (items: MenuItem[] = []) => {
  const sources = useMemo(
    () => [
      ...new Set(
        items
          .map(
            ({ images, fallbackUrl }) =>
              images?.[0]?.url ?? resolveApiAssetUrl(fallbackUrl)
          )
          .filter((source): source is string => Boolean(source))
      ),
    ],
    [items]
  )
  const key = sources.join('\u001f')
  const [readyKey, setReadyKey] = useState<string | null>(null)

  useEffect(() => {
    if (sources.length === 0) return

    let active = true

    void Promise.all(sources.map(preloadImage)).then(() => {
      if (active) setReadyKey(key)
    })

    return () => {
      active = false
    }
  }, [key, sources])

  return sources.length === 0 || readyKey === key
}
