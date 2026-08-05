import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import type { ProductCategory } from '@custom_types/product/product-category'
import { useReorderCategories } from '@hooks/product/useReorderCategories'
import { CategoryService } from '@services/category.service'

import { twoCategoriesPage } from './useReorderCategories.mock'

vi.mock('@services/category.service')

type CategoryList = { data: ProductCategory[] }

const key = queryKeys.productCategories.list('tenant-1')

const idsIn = (client: QueryClient): string[] | undefined =>
  client.getQueryData<CategoryList>(key)?.data.map(({ id }) => id)

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useReorderCategories.name, () => {
  it('reorders cache optimistically before request resolves', async () => {
    // Arrange
    const client = new QueryClient()
    client.setQueryData(key, twoCategoriesPage)
    vi.mocked(CategoryService.setCategoryPosition).mockResolvedValue(
      {} as unknown as ProductCategory
    )
    const { result } = renderHook(() => useReorderCategories('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({
      positions: [
        { id: 'cat-a', position: 2 },
        { id: 'cat-b', position: 1 },
      ],
    })

    // Assert
    await waitFor(() => expect(idsIn(client)).toEqual(['cat-b', 'cat-a']))
  })

  it('rolls back the cache when the request fails', async () => {
    // Arrange
    const client = new QueryClient()
    client.setQueryData(key, twoCategoriesPage)
    vi.mocked(CategoryService.setCategoryPosition).mockRejectedValue(
      new Error('network error')
    )
    const { result } = renderHook(() => useReorderCategories('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ positions: [{ id: 'cat-a', position: 2 }] })
    await waitFor(() => expect(result.current.isError).toBe(true))

    // Assert
    expect(idsIn(client)).toEqual(['cat-a', 'cat-b'])
  })
})
