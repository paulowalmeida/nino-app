import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useCatalogQuery } from '@pages/Catalog/hooks/useCatalogQuery/useCatalogQuery'
import { ProductService } from '@shared/services/product/product.service'
import type { MenuPage } from '@shared/types/product/menu-page'

vi.mock('@shared/services/product/product.service', () => ({
  ProductService: { listProducts: vi.fn() },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe(useCatalogQuery.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('loads filtered products and exposes flattened items and total', async () => {
    vi.mocked(ProductService.listProducts).mockResolvedValue({
      data: [{ id: 'item-1' }],
      pagination: { total: 1 },
    } as unknown as MenuPage)

    const { result } = renderHook(
      () => useCatalogQuery('unit-1', 'cat-1', 'burger'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.status).toBe('success'))

    expect(ProductService.listProducts).toHaveBeenCalledWith('unit-1', {
      page: 1,
      size: 20,
      categoryId: 'cat-1',
      search: 'burger',
    })
    expect(result.current.items).toHaveLength(1)
    expect(result.current.total).toBe(1)
    expect(result.current.hasNextPage).toBe(false)
  })

  it('fetches the next page only while more items exist', async () => {
    vi.mocked(ProductService.listProducts)
      .mockResolvedValueOnce({
        data: [{ id: 'item-1' }],
        pagination: { total: 2 },
      } as unknown as MenuPage)
      .mockResolvedValueOnce({
        data: [{ id: 'item-2' }],
        pagination: { total: 2 },
      } as unknown as MenuPage)

    const { result } = renderHook(() => useCatalogQuery('unit-1', null, ''), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.hasNextPage).toBe(true)

    await result.current.fetchNextPage()

    expect(ProductService.listProducts).toHaveBeenNthCalledWith(2, 'unit-1', {
      page: 2,
      size: 20,
    })
    await waitFor(() => {
      expect(result.current.items.map((item) => item.id)).toEqual([
        'item-1',
        'item-2',
      ])
      expect(result.current.hasNextPage).toBe(false)
    })
  })

  it('does not request products before a unit is available', () => {
    const { result } = renderHook(() => useCatalogQuery(null, null, ''), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(ProductService.listProducts).not.toHaveBeenCalled()
  })
})
