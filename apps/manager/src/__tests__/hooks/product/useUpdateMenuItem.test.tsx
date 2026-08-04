import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useUpdateMenuItem } from '@hooks/product/useUpdateMenuItem'
import { ProductService } from '@services/product.service'

import { updatedItem, updateRequest } from './useUpdateMenuItem.mock'

vi.mock('@services/product.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useUpdateMenuItem.name, () => {
  it('sends the update request for the given product', async () => {
    // Arrange
    vi.mocked(ProductService.updateItem).mockResolvedValue(updatedItem)
    const { result } = renderHook(
      () => useUpdateMenuItem('tenant-1', 'item-1'),
      { wrapper: wrapWithClient() }
    )

    // Act
    result.current.mutate(updateRequest)

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(ProductService.updateItem).toHaveBeenCalledWith(
      'tenant-1',
      'item-1',
      updateRequest
    )
  })

  it('surfaces the error when the update fails', async () => {
    // Arrange
    vi.mocked(ProductService.updateItem).mockRejectedValue(
      new Error('network error')
    )
    const { result } = renderHook(
      () => useUpdateMenuItem('tenant-1', 'item-1'),
      { wrapper: wrapWithClient() }
    )

    // Act
    result.current.mutate(updateRequest)

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
