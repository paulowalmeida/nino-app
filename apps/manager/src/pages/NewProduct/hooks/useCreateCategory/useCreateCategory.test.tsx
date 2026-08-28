import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@shared/lib/query-keys'
import { CategoryService } from '@shared/services/category/category.service'
import type { ProductCategory } from '@shared/types/product/product-category'

import { useCreateCategory } from './useCreateCategory'
import { createCategoryMock } from './useCreateCategory.mock'

vi.mock('@shared/services/category/category.service', () => ({
  CategoryService: { createCategory: vi.fn() },
}))

const queryClient = new QueryClient({
  defaultOptions: { mutations: { retry: false } },
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useCreateCategory', () => {
  afterEach(() => vi.clearAllMocks())

  it('creates the category and refreshes the category list', async () => {
    vi.mocked(CategoryService.createCategory).mockResolvedValue(
      {} as ProductCategory
    )
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(
      () => useCreateCategory(createCategoryMock.tenantId),
      { wrapper }
    )

    result.current.mutate(createCategoryMock.categoryName)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(CategoryService.createCategory).toHaveBeenCalledWith(
      createCategoryMock.tenantId,
      createCategoryMock.categoryName
    )
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.productCategories.all(createCategoryMock.tenantId),
    })
  })

  it('falls back to an empty tenant scope without a tenant', async () => {
    vi.mocked(CategoryService.createCategory).mockResolvedValue(
      {} as ProductCategory
    )
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreateCategory(null), { wrapper })

    result.current.mutate(createCategoryMock.categoryName)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.productCategories.all(''),
    })
  })
})
