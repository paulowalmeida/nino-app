import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { menuQueryKey } from '@shared/hooks/product/useMenu/useMenu'
import { ProductService } from '@shared/services/product/product.service'

import { useUploadProductImage } from './useUploadProductImage'
import { uploadProductImageMock } from './useUploadProductImage.mock'

vi.mock('@shared/services/product/product.service', () => ({
  ProductService: { uploadItemImage: vi.fn() },
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: queryClient }, children)

describe('useUploadProductImage', () => {
  afterEach(() => vi.clearAllMocks())

  it('sends the photo to its own item and refreshes the menu', async () => {
    vi.mocked(ProductService.uploadItemImage).mockResolvedValue(
      undefined as unknown as Awaited<
        ReturnType<typeof ProductService.uploadItemImage>
      >
    )
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const photo = new File([''], uploadProductImageMock.fileName)
    const { result } = renderHook(
      () =>
        useUploadProductImage(
          uploadProductImageMock.tenantId,
          uploadProductImageMock.productId
        ),
      { wrapper }
    )

    result.current.mutate(photo)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(ProductService.uploadItemImage).toHaveBeenCalledWith(
      uploadProductImageMock.tenantId,
      uploadProductImageMock.productId,
      photo
    )
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: menuQueryKey(uploadProductImageMock.tenantId),
    })
  })
})
