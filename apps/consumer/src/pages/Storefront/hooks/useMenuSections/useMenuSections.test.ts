import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useMenuSections } from './useMenuSections'
import { menuSectionsMock } from './useMenuSections.mock'

describe('useMenuSections', () => {
  it('marks the result as a search when a query is provided', () => {
    const { result } = renderHook(() =>
      useMenuSections([], menuSectionsMock.search)
    )
    expect(result.current.isSearching).toBe(true)
    expect(result.current.visibleSections).toEqual([])
  })
})
