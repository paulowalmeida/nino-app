import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { menuQueryKey } from '@shared/hooks/product/useMenu/useMenu'
import { ProductService } from '@shared/services/product/product.service'

import { useDeleteProduct } from './useDeleteProduct'
import { deleteProductMock } from './useDeleteProduct.mock'

vi.mock('@shared/services/product/product.service', () => ({
  ProductService: { removeItem: vi.fn() },
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: queryClient }, children)

const renderDelete = () =>
  renderHook(
    () =>
      useDeleteProduct(deleteProductMock.tenantId, deleteProductMock.productId),
    { wrapper }
  )

describe('useDeleteProduct', () => {
  afterEach(() => vi.clearAllMocks())

  it('removes the item from its own tenant and refreshes the menu', async () => {
    vi.mocked(ProductService.removeItem).mockResolvedValue(
      undefined as unknown as Awaited<
        ReturnType<typeof ProductService.removeItem>
      >
    )
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderDelete()

    result.current.mutate()

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(ProductService.removeItem).toHaveBeenCalledWith(
      deleteProductMock.tenantId,
      deleteProductMock.productId
    )
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: menuQueryKey(deleteProductMock.tenantId),
    })
  })
})
