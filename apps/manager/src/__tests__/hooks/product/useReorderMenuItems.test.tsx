import type { ReactNode } from 'react'

import {
  QueryClient,
  QueryClientProvider,
  type InfiniteData,
} from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import type { MenuItem, MenuPage } from '@custom_types/product'
import { useReorderMenuItems } from '@hooks/product/useReorderMenuItems'
import { ProductService } from '@services/product.service'

import { twoItemPage } from './useReorderMenuItems.mock'

vi.mock('@services/product.service')

const CATEGORY_ID = 'cat-1'

const key = queryKeys.products.catalog('tenant-1', CATEGORY_ID, '')

const idsIn = (client: QueryClient): string[] | undefined =>
  client
    .getQueryData<InfiniteData<MenuPage>>(key)
    ?.pages.flatMap((page) => page.data.map((item) => item.id))

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useReorderMenuItems.name, () => {
  it('reorders cache optimistically before request resolves', async () => {
    // Arrange
    const client = new QueryClient()
    client.setQueryData(key, twoItemPage)
    vi.mocked(ProductService.setItemPosition).mockResolvedValue(
      {} as unknown as MenuItem
    )
    const { result } = renderHook(
      () => useReorderMenuItems('tenant-1', CATEGORY_ID),
      { wrapper: wrapWithClient(client) }
    )

    // Act
    result.current.mutate({
      positions: [
        { id: 'a', position: 2 },
        { id: 'b', position: 1 },
      ],
    })

    // Assert
    await waitFor(() => expect(idsIn(client)).toEqual(['b', 'a']))
  })

  it('keeps the page sizes when it repaginates', async () => {
    // Arrange
    const client = new QueryClient()
    client.setQueryData(key, twoItemPage)
    vi.mocked(ProductService.setItemPosition).mockResolvedValue(
      {} as unknown as MenuItem
    )
    const { result } = renderHook(
      () => useReorderMenuItems('tenant-1', CATEGORY_ID),
      { wrapper: wrapWithClient(client) }
    )

    // Act
    result.current.mutate({ positions: [{ id: 'a', position: 2 }] })

    // Assert
    await waitFor(() => {
      const cached = client.getQueryData<InfiniteData<MenuPage>>(key)
      expect(cached?.pages.map((page) => page.data.length)).toEqual([2])
    })
  })

  it('rolls back the cache when the request fails', async () => {
    // Arrange
    const client = new QueryClient()
    client.setQueryData(key, twoItemPage)
    vi.mocked(ProductService.setItemPosition).mockRejectedValue(
      new Error('network error')
    )
    const { result } = renderHook(
      () => useReorderMenuItems('tenant-1', CATEGORY_ID),
      { wrapper: wrapWithClient(client) }
    )

    // Act
    result.current.mutate({ positions: [{ id: 'a', position: 2 }] })
    await waitFor(() => expect(result.current.isError).toBe(true))

    // Assert
    expect(idsIn(client)).toEqual(['a', 'b'])
  })
})
