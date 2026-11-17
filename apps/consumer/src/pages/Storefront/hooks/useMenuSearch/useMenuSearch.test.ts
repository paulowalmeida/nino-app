import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { MenuSection } from '@custom_types/menu/menu-section'

import { useMenuSearch } from './useMenuSearch'
import { menuSearchHookMock } from './useMenuSearch.mock'

const sections = menuSearchHookMock.sections as unknown as MenuSection[]
const idsFor = (query: string) =>
  renderHook(() => useMenuSearch(sections, query)).result.current.searchResults.map(
    ({ item }) => item.id
  )

describe('useMenuSearch', () => {
  it('returns nothing without a query', () => {
    const { result } = renderHook(() => useMenuSearch(sections, '  '))
    expect(result.current.hasSearchQuery).toBe(false)
    expect(result.current.searchResults).toEqual([])
  })

  it('matches name ignoring accent', () => {
    expect(idsFor('pao')).toEqual(['a'])
  })

  it('matches description', () => {
    expect(idsFor('laranja')).toEqual(['b'])
  })

  it('matches the category and keeps its name', () => {
    const { result } = renderHook(() => useMenuSearch(sections, 'bebidas'))
    expect(result.current.searchResults).toEqual([
      expect.objectContaining({ categoryName: 'Bebidas' }),
    ])
  })
})
