import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CategoryService } from '@shared/services/category/category.service'
import { removeCategoryMessageMock } from '@shared/services/category/category.service/category.service.mock'

import { useDeleteCategory } from './useDeleteCategory'
import { deleteCategoryMock } from './useDeleteCategory.mock'

vi.mock('@shared/services/category/category.service', () => ({
  CategoryService: { removeCategory: vi.fn() },
}))
vi.mock('@shared/hooks/product/invalidate-category-queries/invalidate-category-queries', () => ({
  invalidateCategoryQueries: vi.fn(),
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useDeleteCategory.name, () => {
  it('removes the selected category from the selected unit', async () => {
    vi.mocked(CategoryService.removeCategory).mockResolvedValue(removeCategoryMessageMock)
    const { result } = renderHook(() => useDeleteCategory(deleteCategoryMock.unitId), { wrapper })
    await result.current.mutateAsync(deleteCategoryMock.categoryId)
    expect(CategoryService.removeCategory).toHaveBeenCalledWith(
      deleteCategoryMock.unitId,
      deleteCategoryMock.categoryId
    )
  })
})
