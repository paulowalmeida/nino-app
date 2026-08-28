import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useCatalogCategoriesQuery } from '@pages/Catalog/hooks/useCatalogCategoriesQuery/useCatalogCategoriesQuery'
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

  it('loads categories sorted by their persisted position', async () => {
    vi.mocked(CategoryService.listCategories).mockResolvedValue({
      data: [
        { id: 'cat-2', position: 2, productCount: 1 },
        { id: 'cat-1', position: 1, productCount: 3 },
      ],
    } as unknown as { data: CategoryWithProductCount[] })

    const { result } = renderHook(
      () => useCatalogCategoriesQuery('tenant-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.status).toBe('success'))

    expect(CategoryService.listCategories).toHaveBeenCalledWith('tenant-1')
    expect(result.current.categories.map(({ id }) => id)).toEqual([
      'cat-1',
      'cat-2',
    ])
  })

  it('does not request categories before a tenant is available', () => {
    const { result } = renderHook(
      () => useCatalogCategoriesQuery(null),
      { wrapper: createWrapper() }
    )

    expect(result.current.fetchStatus).toBe('idle')
    expect(CategoryService.listCategories).not.toHaveBeenCalled()
  })
})
