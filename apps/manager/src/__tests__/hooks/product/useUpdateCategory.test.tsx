import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { ProductCategory } from '@custom_types/product/product-category'
import { useUpdateCategory } from '@hooks/product/useUpdateCategory'
import { CategoryService } from '@services/category.service'

vi.mock('@services/category.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useUpdateCategory.name, () => {
  it('sends the updated name to the service', async () => {
    // Arrange
    vi.mocked(CategoryService.updateCategory).mockResolvedValue(
      {} as unknown as ProductCategory
    )
    const client = new QueryClient()
    const { result } = renderHook(() => useUpdateCategory('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ id: 'cat-a', name: 'Combos' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Assert
    expect(CategoryService.updateCategory).toHaveBeenCalledWith(
      'tenant-1',
      'cat-a',
      'Combos'
    )
  })
})
