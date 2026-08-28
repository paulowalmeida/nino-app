import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { menuQueryKey } from '@shared/hooks/product/useMenu/useMenu'
import { queryKeys } from '@shared/lib/query-keys'
import { ProductService } from '@shared/services/product/product.service'

import { useCreateProduct } from './useCreateProduct'
import {
  createdProductMock,
  createProductRequestMock,
} from './useCreateProduct.mock'

vi.mock('@shared/services/product/product.service', () => ({
  ProductService: { createItemWithImage: vi.fn() },
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: queryClient }, children)

describe('useCreateProduct', () => {
  afterEach(() => vi.clearAllMocks())

  it('sends the item with its staged photo', async () => {
    vi.mocked(ProductService.createItemWithImage).mockResolvedValue(
      createdProductMock as unknown as Awaited<
        ReturnType<typeof ProductService.createItemWithImage>
      >
    )
    const image = new File([''], 'photo.png')
    const { result } = renderHook(() => useCreateProduct('tenant-1'), {
      wrapper,
    })

    result.current.mutate({ data: createProductRequestMock, image })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(ProductService.createItemWithImage).toHaveBeenCalledWith(
      'tenant-1',
      createProductRequestMock,
      image
    )
  })

  it('refreshes the menu the new item belongs to', async () => {
    vi.mocked(ProductService.createItemWithImage).mockResolvedValue(
      createdProductMock as unknown as Awaited<
        ReturnType<typeof ProductService.createItemWithImage>
      >
    )
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreateProduct('tenant-1'), {
      wrapper,
    })

    result.current.mutate({ data: createProductRequestMock, image: null })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: menuQueryKey('tenant-1'),
    })
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.productCategories.all('tenant-1'),
    })
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.products.all('tenant-1'),
    })
  })

  it('falls back to an empty tenant scope without a tenant', async () => {
    vi.mocked(ProductService.createItemWithImage).mockResolvedValue(
      createdProductMock as unknown as Awaited<
        ReturnType<typeof ProductService.createItemWithImage>
      >
    )
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreateProduct(null), { wrapper })

    result.current.mutate({ data: createProductRequestMock, image: null })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.productCategories.all(''),
    })
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.products.all(''),
    })
  })
})
