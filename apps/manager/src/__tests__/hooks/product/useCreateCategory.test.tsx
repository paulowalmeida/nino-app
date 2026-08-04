import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@constants/query-keys'
import type { ProductCategory } from '@custom_types/product'
import { useCreateCategory } from '@hooks/product/useCreateCategory'
import { CategoryService } from '@services/category.service'

vi.mock('@services/category.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useCreateCategory.name, () => {
  it('invalidates the category list on success', async () => {
    // Arrange
    vi.mocked(CategoryService.createCategory).mockResolvedValue(
      {} as unknown as ProductCategory
    )
    const client = new QueryClient()
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(() => useCreateCategory('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate('Sobremesas')
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Assert
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.productCategories.all('tenant-1'),
    })
  })
})
