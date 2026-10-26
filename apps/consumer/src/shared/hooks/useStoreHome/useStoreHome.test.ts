import { renderHook } from '@testing-library/react'
import { useParams } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { useStore } from '@hooks/useStore/useStore'
import { resolveSlug } from '@utils/resolve-slug'

import { useStoreHome } from './useStoreHome'
import {
  storeWithHiddenBlocksMock,
  storeWithoutHomeChoiceMock,
} from './useStoreHome.mock'

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useParams: vi.fn() }
})
vi.mock('@hooks/useStore/useStore')
vi.mock('@utils/resolve-slug')

const renderWith = (fixture: typeof storeWithHiddenBlocksMock) => {
  vi.mocked(useParams).mockReturnValue({ slug: fixture.slug })
  vi.mocked(resolveSlug).mockReturnValue(fixture.slug)
  vi.mocked(useStore).mockReturnValue({
    store: fixture.store,
  } as unknown as ReturnType<typeof useStore>)

  return renderHook(() => useStoreHome())
}

describe('useStoreHome', () => {
  it('hides the blocks the store turned off', () => {
    const { result } = renderWith(storeWithHiddenBlocksMock)

    expect(result.current.showBanner).toBe(false)
    expect(result.current.showSearch).toBe(false)
    expect(result.current.showCategoryBar).toBe(true)
  })

  it('shows everything for a store that never chose', () => {
    const { result } = renderWith(storeWithoutHomeChoiceMock)

    expect(result.current).toEqual({
      showBanner: true,
      showSearch: true,
      showCategoryBar: true,
      showStoreInfo: true,
    })
  })
})
