import { useEffect, useMemo, useState } from 'react'

import type { MenuItem } from '@shared/types/product/menu-item'
import { resolveApiAssetUrl } from '@shared/utils/api-asset-url/api-asset-url'

const pendingImages = new Map<string, Promise<boolean>>()
const settledImages = new Map<string, boolean>()

const preloadImage = (source: string) => {
  const pending = pendingImages.get(source)
  if (pending) return pending

  const promise = new Promise<boolean>((resolve) => {
    const image = new Image()
    let settled = false

    const settle = (loaded: boolean) => {
      if (settled) return
      settled = true
      settledImages.set(source, loaded)
      resolve(loaded)
    }
    const settleAfterDecode = () => {
      if (!image.decode) return settle(true)
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

const loadedAmong = (sources: string[]): ReadonlySet<string> =>
  new Set(sources.filter((source) => settledImages.get(source)))

/**
 * Keeps a list skeleton visible until every rendered product photo decodes,
 * and reports which photos decoded so their rows can skip the fade-in.
 */
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
  const areAllSettled = sources.every((source) => settledImages.has(source))

  useEffect(() => {
    if (areAllSettled) return

    let active = true

    void Promise.all(sources.map(preloadImage)).then(() => {
      if (active) setReadyKey(key)
    })

    return () => {
      active = false
    }
  }, [areAllSettled, key, sources])

  const areImagesReady = areAllSettled || readyKey === key

  return {
    areImagesReady,
    loadedSources: areImagesReady ? loadedAmong(sources) : new Set<string>(),
  }
}
