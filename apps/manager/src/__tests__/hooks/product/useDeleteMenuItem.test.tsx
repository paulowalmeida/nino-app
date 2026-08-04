import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useDeleteMenuItem } from '@hooks/product/useDeleteMenuItem'
import { ProductService } from '@services/product.service'

vi.mock('@services/product.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useDeleteMenuItem.name, () => {
  it('removes the item and invalidates the menu on success', async () => {
    // Arrange
    vi.mocked(ProductService.removeItem).mockResolvedValue({
      message: 'ok',
    })
    const client = new QueryClient()
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(
      () => useDeleteMenuItem('tenant-1', 'item-1'),
      { wrapper: wrapWithClient(client) }
    )

    // Act
    result.current.mutate()
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Assert
    expect(ProductService.removeItem).toHaveBeenCalledWith(
      'tenant-1',
      'item-1'
    )
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['menu', 'tenant-1'],
    })
  })

  it('sets isError with no rollback when the request fails', async () => {
    // Arrange
    vi.mocked(ProductService.removeItem).mockRejectedValue(
      new Error('has active orders')
    )
    const client = new QueryClient()
    const { result } = renderHook(
      () => useDeleteMenuItem('tenant-1', 'item-1'),
      { wrapper: wrapWithClient(client) }
    )

    // Act
    result.current.mutate()

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
