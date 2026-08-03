import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import type { ProductCategory } from '@custom_types/product'
import { setCategoryPosition } from '@services/product/product.service'

import { useReorderCategories } from './useReorderCategories'

vi.mock('@services/product/product.service')

type CategoryList = { data: ProductCategory[] }

const key = queryKeys.productCategories.list('tenant-1')

const buildList = (): CategoryList => ({
  data: [
    { id: 'cat-a', name: 'Lanches', position: 1 } as ProductCategory,
    { id: 'cat-b', name: 'Bebidas', position: 2 } as ProductCategory,
  ],
})

const idsIn = (client: QueryClient): string[] | undefined =>
  client.getQueryData<CategoryList>(key)?.data.map(({ id }) => id)

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useReorderCategories.name, () => {
  it('reorders the cache optimistically before the request resolves', async () => {
    const client = new QueryClient()
    client.setQueryData(key, buildList())
    vi.mocked(setCategoryPosition).mockResolvedValue(
      {} as unknown as ProductCategory
    )

    const { result } = renderHook(() => useReorderCategories('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    result.current.mutate({
      positions: [
        { id: 'cat-a', position: 2 },
        { id: 'cat-b', position: 1 },
      ],
    })

    await waitFor(() => expect(idsIn(client)).toEqual(['cat-b', 'cat-a']))
  })

  it('rolls back the cache when the request fails', async () => {
    const client = new QueryClient()
    client.setQueryData(key, buildList())
    vi.mocked(setCategoryPosition).mockRejectedValue(new Error('network error'))

    const { result } = renderHook(() => useReorderCategories('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    result.current.mutate({ positions: [{ id: 'cat-a', position: 2 }] })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(idsIn(client)).toEqual(['cat-a', 'cat-b'])
  })
})
