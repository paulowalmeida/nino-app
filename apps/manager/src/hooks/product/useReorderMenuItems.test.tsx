import type { ReactNode } from 'react'

import {
  QueryClient,
  QueryClientProvider,
  type InfiniteData,
} from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import type { MenuPage } from '@custom_types/product'
import { setItemPosition } from '@services/product/product.service'

import { useReorderMenuItems } from './useReorderMenuItems'

vi.mock('@services/product/product.service')

const CATEGORY_ID = 'cat-1'

const key = queryKeys.products.catalog('tenant-1', CATEGORY_ID, '')

const buildPages = (): InfiniteData<MenuPage> => ({
  pageParams: [1],
  pages: [
    {
      data: [
        { id: 'a', position: 1 } as MenuPage['data'][number],
        { id: 'b', position: 2 } as MenuPage['data'][number],
      ],
      pagination: { total: 2 },
    },
  ],
})

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
  it('reorders the cache optimistically before the request resolves', async () => {
    const client = new QueryClient()
    client.setQueryData(key, buildPages())
    vi.mocked(setItemPosition).mockResolvedValue({} as never)

    const { result } = renderHook(
      () => useReorderMenuItems('tenant-1', CATEGORY_ID),
      { wrapper: wrapWithClient(client) }
    )

    result.current.mutate({
      positions: [
        { id: 'a', position: 2 },
        { id: 'b', position: 1 },
      ],
    })

    await waitFor(() => expect(idsIn(client)).toEqual(['b', 'a']))
  })

  it('keeps the page sizes when it repaginates', async () => {
    const client = new QueryClient()
    client.setQueryData(key, buildPages())
    vi.mocked(setItemPosition).mockResolvedValue({} as never)

    const { result } = renderHook(
      () => useReorderMenuItems('tenant-1', CATEGORY_ID),
      { wrapper: wrapWithClient(client) }
    )

    result.current.mutate({ positions: [{ id: 'a', position: 2 }] })

    await waitFor(() => {
      const cached = client.getQueryData<InfiniteData<MenuPage>>(key)
      expect(cached?.pages.map((page) => page.data.length)).toEqual([2])
    })
  })

  it('rolls back the cache when the request fails', async () => {
    const client = new QueryClient()
    client.setQueryData(key, buildPages())
    vi.mocked(setItemPosition).mockRejectedValue(new Error('network error'))

    const { result } = renderHook(
      () => useReorderMenuItems('tenant-1', CATEGORY_ID),
      { wrapper: wrapWithClient(client) }
    )

    result.current.mutate({ positions: [{ id: 'a', position: 2 }] })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(idsIn(client)).toEqual(['a', 'b'])
  })
})
