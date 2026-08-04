import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useDeleteCategory } from '@hooks/product/useDeleteCategory'
import { CategoryService } from '@services/category.service'

vi.mock('@services/category.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useDeleteCategory.name, () => {
  it('sends the delete request with a silent error on failure', async () => {
    // Arrange
    vi.mocked(CategoryService.removeCategory).mockRejectedValue(
      new Error('has products')
    )
    const client = new QueryClient()
    const { result } = renderHook(() => useDeleteCategory('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate('cat-a')
    await waitFor(() => expect(result.current.isError).toBe(true))

    // Assert
    expect(CategoryService.removeCategory).toHaveBeenCalledWith(
      'tenant-1',
      'cat-a'
    )
  })
})
