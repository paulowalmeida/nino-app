import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useDeleteMenuItems } from '@hooks/product/useDeleteMenuItems'
import { ProductService } from '@services/product.service'

vi.mock('@services/product.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useDeleteMenuItems.name, () => {
  it('removes every item and invalidates menu and catalog caches', async () => {
    // Arrange
    vi.mocked(ProductService.removeItem).mockResolvedValue({ message: 'ok' })
    const client = new QueryClient()
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(() => useDeleteMenuItems('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate(['item-1', 'item-2'])
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Assert
    expect(ProductService.removeItem).toHaveBeenCalledWith(
      'tenant-1',
      'item-1'
    )
    expect(ProductService.removeItem).toHaveBeenCalledWith(
      'tenant-1',
      'item-2'
    )
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['menu', 'tenant-1'],
    })
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['products', 'tenant-1'],
    })
  })

  it('resolves with no calls when given an empty selection', async () => {
    // Arrange
    vi.mocked(ProductService.removeItem).mockClear()
    const client = new QueryClient()
    const { result } = renderHook(() => useDeleteMenuItems('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate([])
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Assert
    expect(ProductService.removeItem).not.toHaveBeenCalled()
  })

  it('sets isError when at least one deletion fails', async () => {
    // Arrange
    vi.mocked(ProductService.removeItem)
      .mockResolvedValueOnce({ message: 'ok' })
      .mockRejectedValueOnce(new Error('has active orders'))
    const client = new QueryClient()
    const { result } = renderHook(() => useDeleteMenuItems('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate(['item-1', 'item-2'])

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
