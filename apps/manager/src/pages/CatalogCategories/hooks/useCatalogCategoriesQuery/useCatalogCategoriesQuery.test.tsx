import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useCatalogCategoriesQuery } from '@pages/CatalogCategories/hooks/useCatalogCategoriesQuery/useCatalogCategoriesQuery'
import { CategoryService } from '@shared/services/category/category.service'
import type { CategoryWithProductCount } from '@shared/types/product/category-with-product-count'

vi.mock('@shared/services/category/category.service', () => ({
  CategoryService: { listCategories: vi.fn() },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe(useCatalogCategoriesQuery.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('loads categories with backend-provided item counts', async () => {
    vi.mocked(CategoryService.listCategories).mockResolvedValue({
      data: [
        { id: 'desserts', name: 'Sobremesas', position: 20, productCount: 0 },
        { id: 'drinks', name: 'Bebidas', position: 10, productCount: 1 },
      ],
    } as unknown as { data: CategoryWithProductCount[] })

    const { result } = renderHook(() => useCatalogCategoriesQuery('unit-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isPending).toBe(false))

    expect(CategoryService.listCategories).toHaveBeenCalledWith('unit-1')
    expect(result.current.rows.map(({ id, count }) => [id, count])).toEqual([
      ['drinks', 1],
      ['desserts', 0],
    ])
    expect(result.current.isError).toBe(false)
  })

  it('does not request categories before a unit is available', () => {
    const { result } = renderHook(() => useCatalogCategoriesQuery(null), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(true)
    expect(CategoryService.listCategories).not.toHaveBeenCalled()
  })

  it('reports a categories request failure for Page governance', async () => {
    vi.mocked(CategoryService.listCategories).mockRejectedValue(
      new Error('offline')
    )

    const { result } = renderHook(() => useCatalogCategoriesQuery('unit-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
