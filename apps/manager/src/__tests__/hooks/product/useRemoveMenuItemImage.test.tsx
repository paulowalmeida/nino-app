import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useRemoveMenuItemImage } from '@hooks/product/useRemoveMenuItemImage'
import { ProductService } from '@services/product.service'

vi.mock('@services/product.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useRemoveMenuItemImage.name, () => {
  it('removes the image and invalidates the menu on success', async () => {
    vi.mocked(ProductService.removeItemImage).mockResolvedValue({
      message: 'ok',
    })
    const client = new QueryClient()
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(
      () => useRemoveMenuItemImage('tenant-1', 'item-1'),
      { wrapper: wrapWithClient(client) }
    )

    result.current.mutate('image-1')

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(ProductService.removeItemImage).toHaveBeenCalledWith(
      'tenant-1',
      'item-1',
      'image-1'
    )
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['menu', 'tenant-1'],
    })
  })
})
