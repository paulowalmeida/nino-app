import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CategoryService } from '@shared/services/category/category.service'

import { useProductCategoryOptions } from './useProductCategoryOptions'
import { categoryPageMock } from './useProductCategoryOptions.mock'

vi.mock('@shared/services/category/category.service', () => ({
  CategoryService: { listCategories: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

describe('useProductCategoryOptions', () => {
  afterEach(() => vi.clearAllMocks())

  it('offers the categories in the order the store arranged them', async () => {
    vi.mocked(CategoryService.listCategories).mockResolvedValue(
      categoryPageMock as unknown as Awaited<
        ReturnType<typeof CategoryService.listCategories>
      >
    )

    const { result } = renderHook(
      () => useProductCategoryOptions('tenant-1'),
      { wrapper }
    )

    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.categoryOptions).toEqual([
      { value: 'category-1', label: 'Lanches' },
      { value: 'category-2', label: 'Bebidas' },
    ])
  })

  it('does not ask the API without a tenant', () => {
    const { result } = renderHook(() => useProductCategoryOptions(null), {
      wrapper,
    })

    expect(CategoryService.listCategories).not.toHaveBeenCalled()
    expect(result.current.categoryOptions).toEqual([])
  })
})
