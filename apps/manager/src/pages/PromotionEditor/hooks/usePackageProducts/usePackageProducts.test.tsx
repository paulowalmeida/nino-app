import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ProductService } from '@shared/services/product/product.service'
import type { MenuPage } from '@shared/types/product/menu-page'

import { usePackageProducts } from './usePackageProducts'

vi.mock('@shared/services/product/product.service', () => ({
  ProductService: { listProducts: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

describe(usePackageProducts.name, () => {
  it('loads one package-eligible page ordered by the API', async () => {
    vi.mocked(ProductService.listProducts).mockResolvedValue({
      data: [],
      pagination: { total: 0, page: 2, size: 20 },
    } as MenuPage)

    const { result } = renderHook(
      () =>
        usePackageProducts('unit-1', {
          page: 2,
          size: 20,
          search: 'batata',
          sortBy: 'category',
          direction: 'desc',
        }),
      { wrapper }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(ProductService.listProducts).toHaveBeenCalledWith('unit-1', {
      page: 2,
      size: 20,
      search: 'batata',
      sortBy: 'category',
      direction: 'desc',
      packageEligible: true,
    })
  })
})
