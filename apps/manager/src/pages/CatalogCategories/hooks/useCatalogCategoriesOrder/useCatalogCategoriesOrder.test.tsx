import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCatalogCategoriesOrder } from '@pages/CatalogCategories/hooks/useCatalogCategoriesOrder/useCatalogCategoriesOrder'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'

const rows = [
  { id: 'drinks', position: 10 },
  { id: 'desserts', position: 20 },
] as CategoryWithCount[]

describe(useCatalogCategoriesOrder.name, () => {
  it('synchronizes visual order when query rows change', () => {
    const setOrder = vi.fn()

    renderHook(() => useCatalogCategoriesOrder(rows, [], setOrder, vi.fn()))

    expect(setOrder).toHaveBeenCalledWith(rows)
  })

  it('keeps an equivalent visual order untouched', () => {
    const setOrder = vi.fn()

    renderHook(() => useCatalogCategoriesOrder(rows, rows, setOrder, vi.fn()))

    expect(setOrder).not.toHaveBeenCalled()
  })

  it('persists the visual order as category identifiers', () => {
    const reorder = vi.fn()
    const visualOrder = [...rows].reverse()
    const { result } = renderHook(() =>
      useCatalogCategoriesOrder(rows, visualOrder, vi.fn(), reorder)
    )

    act(() => result.current.persistOrder())

    expect(reorder).toHaveBeenCalledWith({
      ids: ['desserts', 'drinks'],
    })
  })

  it('does not call the backend while positions are unchanged', () => {
    const reorder = vi.fn()
    const { result } = renderHook(() =>
      useCatalogCategoriesOrder(rows, rows, vi.fn(), reorder)
    )

    act(() => result.current.persistOrder())

    expect(reorder).not.toHaveBeenCalled()
  })
})
