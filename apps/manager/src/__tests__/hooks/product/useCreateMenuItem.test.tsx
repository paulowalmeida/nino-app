import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCreateMenuItem } from '@hooks/product/useCreateMenuItem'
import { ProductService } from '@services/product.service'

import { createdItem, newItemRequest } from './useCreateMenuItem.mock'

vi.mock('@services/product.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useCreateMenuItem.name, () => {
  it('sends the new item to the service and invalidates the menu', async () => {
    // Arrange
    vi.mocked(ProductService.createItemWithImage).mockResolvedValue({
      item: createdItem,
      imageUploadFailed: false,
    })
    const client = new QueryClient()
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(() => useCreateMenuItem('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ data: newItemRequest, image: null })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Assert
    expect(ProductService.createItemWithImage).toHaveBeenCalledWith(
      'tenant-1',
      newItemRequest,
      null
    )
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['menu', 'tenant-1'],
    })
  })

  it('surfaces the failure through isError with no thrown exception', async () => {
    // Arrange
    vi.mocked(ProductService.createItemWithImage).mockRejectedValue(
      new Error('slug taken')
    )
    const client = new QueryClient()
    const { result } = renderHook(() => useCreateMenuItem('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ data: newItemRequest, image: null })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
