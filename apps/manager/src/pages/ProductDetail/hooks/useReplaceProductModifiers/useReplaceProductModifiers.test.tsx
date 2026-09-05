import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@shared/lib/query-keys'
import { ProductService } from '@shared/services/product/product.service'

import { useReplaceProductModifiers } from './useReplaceProductModifiers'
import {
  replaceProductModifiersContextMock,
  replaceProductModifiersRequestMock,
} from './useReplaceProductModifiers.mock'

vi.mock('@shared/services/product/product.service', () => ({
  ProductService: { replaceItemModifiers: vi.fn() },
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: queryClient }, children)

describe('useReplaceProductModifiers', () => {
  afterEach(() => vi.clearAllMocks())

  it('replaces the product choices in its tenant', async () => {
    vi.mocked(ProductService.replaceItemModifiers).mockResolvedValue(
      undefined as unknown as Awaited<
        ReturnType<typeof ProductService.replaceItemModifiers>
      >
    )
    const { result } = renderHook(
      () =>
        useReplaceProductModifiers(
          replaceProductModifiersContextMock.tenantId,
          replaceProductModifiersContextMock.productId
        ),
      { wrapper }
    )

    result.current.mutate(replaceProductModifiersRequestMock)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(ProductService.replaceItemModifiers).toHaveBeenCalledWith(
      replaceProductModifiersContextMock.tenantId,
      replaceProductModifiersContextMock.productId,
      replaceProductModifiersRequestMock
    )
  })

  it('uses the empty cache scope when the tenant is unavailable', async () => {
    vi.mocked(ProductService.replaceItemModifiers).mockResolvedValue(
      undefined as unknown as Awaited<
        ReturnType<typeof ProductService.replaceItemModifiers>
      >
    )
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(
      () =>
        useReplaceProductModifiers(
          null,
          replaceProductModifiersContextMock.productId
        ),
      { wrapper }
    )

    result.current.mutate(replaceProductModifiersRequestMock)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.products.all(''),
    })
  })
})
