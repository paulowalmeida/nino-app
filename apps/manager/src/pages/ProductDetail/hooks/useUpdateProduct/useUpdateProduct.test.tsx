import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { menuQueryKey } from '@shared/hooks/product/useMenu/useMenu'
import { queryKeys } from '@shared/lib/query-keys'
import { ProductService } from '@shared/services/product/product.service'

import { useUpdateProduct } from './useUpdateProduct'
import {
  updateProductMock,
  updateProductRequestMock,
} from './useUpdateProduct.mock'

vi.mock('@shared/services/product/product.service', () => ({
  ProductService: { updateItem: vi.fn() },
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: queryClient }, children)

const renderUpdate = () =>
  renderHook(
    () =>
      useUpdateProduct(updateProductMock.tenantId, updateProductMock.productId),
    { wrapper }
  )

describe('useUpdateProduct', () => {
  afterEach(() => vi.clearAllMocks())

  it('saves the edited item on its own tenant and product', async () => {
    vi.mocked(ProductService.updateItem).mockResolvedValue(
      undefined as unknown as Awaited<
        ReturnType<typeof ProductService.updateItem>
      >
    )
    const { result } = renderUpdate()

    result.current.mutate(updateProductRequestMock)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(ProductService.updateItem).toHaveBeenCalledWith(
      updateProductMock.tenantId,
      updateProductMock.productId,
      updateProductRequestMock
    )
  })

  it('refreshes the menu the saved item belongs to', async () => {
    vi.mocked(ProductService.updateItem).mockResolvedValue(
      undefined as unknown as Awaited<
        ReturnType<typeof ProductService.updateItem>
      >
    )
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderUpdate()

    result.current.mutate(updateProductRequestMock)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: menuQueryKey(updateProductMock.tenantId),
    })
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.productCategories.all(updateProductMock.tenantId),
    })
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.products.all(updateProductMock.tenantId),
    })
  })

  it('falls back to an empty tenant scope without a tenant', async () => {
    vi.mocked(ProductService.updateItem).mockResolvedValue(
      undefined as unknown as Awaited<
        ReturnType<typeof ProductService.updateItem>
      >
    )
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(
      () => useUpdateProduct(null, updateProductMock.productId),
      { wrapper }
    )

    result.current.mutate(updateProductRequestMock)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.productCategories.all(''),
    })
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.products.all(''),
    })
  })
})
