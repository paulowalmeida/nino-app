import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { menuQueryKey } from '@shared/hooks/product/useMenu/useMenu'
import { ProductService } from '@shared/services/product/product.service'

import { useRemoveProductImage } from './useRemoveProductImage'
import { removeProductImageMock } from './useRemoveProductImage.mock'

vi.mock('@shared/services/product/product.service', () => ({
  ProductService: { removeItemImage: vi.fn() },
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: queryClient }, children)

describe('useRemoveProductImage', () => {
  afterEach(() => vi.clearAllMocks())

  it('drops the chosen photo and refreshes the menu', async () => {
    vi.mocked(ProductService.removeItemImage).mockResolvedValue(
      undefined as unknown as Awaited<
        ReturnType<typeof ProductService.removeItemImage>
      >
    )
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(
      () =>
        useRemoveProductImage(
          removeProductImageMock.tenantId,
          removeProductImageMock.productId
        ),
      { wrapper }
    )

    result.current.mutate(removeProductImageMock.imageId)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(ProductService.removeItemImage).toHaveBeenCalledWith(
      removeProductImageMock.tenantId,
      removeProductImageMock.productId,
      removeProductImageMock.imageId
    )
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: menuQueryKey(removeProductImageMock.tenantId),
    })
  })
})
