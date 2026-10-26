import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useProductImagesReady } from '@shared/hooks/product/useProductImagesReady/useProductImagesReady'

import { useCatalogListReveal } from './useCatalogListReveal'
import {
  revealItemsMock,
  revealTwoPagesMock,
} from './useCatalogListReveal.mock'

vi.mock('@shared/hooks/product/useProductImagesReady/useProductImagesReady')

const imagesReady = (areImagesReady: boolean, loaded: string[] = []) =>
  vi.mocked(useProductImagesReady).mockReturnValue({
    areImagesReady,
    loadedSources: new Set(loaded),
  })

describe(useCatalogListReveal.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('holds the first reveal until the list loads and its photos decode', () => {
    imagesReady(false)

    const { result, rerender } = renderHook(
      ({ isLoaded }) => useCatalogListReveal(revealItemsMock, isLoaded, false),
      { initialProps: { isLoaded: false } }
    )

    expect(result.current.isFirstRevealPending).toBe(true)

    imagesReady(true)
    rerender({ isLoaded: true })

    expect(result.current.isFirstRevealPending).toBe(false)
    expect(result.current.isListSwitching).toBe(false)
  })

  it('reports a list switch, not a first reveal, once the screen was shown', () => {
    imagesReady(true)

    const { result, rerender } = renderHook(
      ({ isPlaceholderData }) =>
        useCatalogListReveal(revealItemsMock, true, isPlaceholderData),
      { initialProps: { isPlaceholderData: false } }
    )

    rerender({ isPlaceholderData: true })

    expect(result.current.isFirstRevealPending).toBe(false)
    expect(result.current.isListSwitching).toBe(true)
  })

  it('waits only for the photos of the first page', () => {
    imagesReady(true)

    renderHook(() => useCatalogListReveal(revealTwoPagesMock, true, false))

    expect(vi.mocked(useProductImagesReady).mock.calls[0][0]).toHaveLength(20)
  })

  it('marks the rows whose photo already decoded', () => {
    imagesReady(true, ['/coxinha.png'])

    const { result } = renderHook(() =>
      useCatalogListReveal(revealItemsMock, true, false)
    )

    expect(result.current.preloadedImageItemIds).toEqual(new Set(['item-1']))
  })
})
