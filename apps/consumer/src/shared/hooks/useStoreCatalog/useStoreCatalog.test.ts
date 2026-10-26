import { renderHook } from '@testing-library/react'
import { useParams } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { useStore } from '@hooks/useStore/useStore'
import { resolveSlug } from '@utils/resolve-slug'

import { useStoreCatalog } from './useStoreCatalog'
import {
  storeWithBigImageCatalogMock,
  storeWithoutCatalogChoiceMock,
} from './useStoreCatalog.mock'

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useParams: vi.fn() }
})
vi.mock('@hooks/useStore/useStore')
vi.mock('@utils/resolve-slug')

const renderWith = (fixture: typeof storeWithBigImageCatalogMock) => {
  vi.mocked(useParams).mockReturnValue({ slug: fixture.slug })
  vi.mocked(resolveSlug).mockReturnValue(fixture.slug)
  vi.mocked(useStore).mockReturnValue({
    store: fixture.store,
  } as unknown as ReturnType<typeof useStore>)

  return renderHook(() => useStoreCatalog())
}

describe('useStoreCatalog', () => {
  it('follows the presentation the store published', () => {
    const { result } = renderWith(storeWithBigImageCatalogMock)

    expect(result.current.itemStyle).toBe('big-image')
    expect(result.current.showDescription).toBe(false)
  })

  it('keeps the nino default for a store that never chose one', () => {
    const { result } = renderWith(storeWithoutCatalogChoiceMock)

    expect(result.current).toEqual({
      itemStyle: 'side-image',
      imageRatio: '4:3',
      density: 'comfortable',
      showDescription: true,
    })
  })
})
