import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useProductImagesReady } from './useProductImagesReady'
import {
  productWithBrokenPhotoMock,
  productWithPhotoMock,
} from './useProductImagesReady.mock'

const preloads: Array<{
  source: string
  onload: (() => void) | null
  onerror: (() => void) | null
}> = []

class PendingImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  complete = false
  naturalWidth = 0
  source = ''

  set src(source: string) {
    this.source = source
    preloads.push(this)
  }

  decode = () => Promise.resolve()
}

describe(useProductImagesReady.name, () => {
  afterEach(() => vi.unstubAllGlobals())

  it('is ready at once when no product has a photo', () => {
    const { result } = renderHook(() => useProductImagesReady([]))

    expect(result.current.areImagesReady).toBe(true)
  })

  it('waits for every photo and reports only the ones that decoded', async () => {
    vi.stubGlobal('Image', PendingImage)

    const { result } = renderHook(() =>
      useProductImagesReady([productWithPhotoMock, productWithBrokenPhotoMock])
    )

    expect(result.current.areImagesReady).toBe(false)
    await waitFor(() => expect(preloads).toHaveLength(2))

    preloads[0].onload?.()
    preloads[1].onerror?.()

    await waitFor(() => expect(result.current.areImagesReady).toBe(true))
    expect(result.current.loadedSources).toEqual(
      new Set(['/ready-coxinha.png'])
    )
  })

  it('reuses decoded photos without waiting a second time', async () => {
    vi.stubGlobal('Image', PendingImage)
    const cachedProduct = {
      ...productWithPhotoMock,
      images: [{ id: 'image-3', url: '/cached-esfiha.png', isPrimary: true }],
    }
    const first = renderHook(() => useProductImagesReady([cachedProduct]))
    await waitFor(() =>
      expect(
        preloads.some(({ source }) => source === '/cached-esfiha.png')
      ).toBe(true)
    )
    preloads.find(({ source }) => source === '/cached-esfiha.png')?.onload?.()
    await waitFor(() => expect(first.result.current.areImagesReady).toBe(true))
    first.unmount()

    const { result } = renderHook(() => useProductImagesReady([cachedProduct]))

    expect(result.current.areImagesReady).toBe(true)
    expect(result.current.loadedSources).toEqual(
      new Set(['/cached-esfiha.png'])
    )
  })
})
