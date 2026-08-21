import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useUploadMenuItemImage } from '@hooks/product/useUploadMenuItemImage'
import { ProductService } from '@services/product.service'

import { uploadedImage } from './useItemImages.mock'

vi.mock('@services/product.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useUploadMenuItemImage.name, () => {
  it('uploads the file and invalidates the menu on success', async () => {
    vi.mocked(ProductService.uploadItemImage).mockResolvedValue(uploadedImage)
    const client = new QueryClient()
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(
      () => useUploadMenuItemImage('tenant-1', 'item-1'),
      { wrapper: wrapWithClient(client) }
    )
    const file = new File(['x'], 'photo.png', { type: 'image/png' })

    result.current.mutate(file)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(ProductService.uploadItemImage).toHaveBeenCalledWith(
      'tenant-1',
      'item-1',
      file
    )
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['menu', 'tenant-1'],
    })
  })

  it('surfaces upload failure through isError', async () => {
    vi.mocked(ProductService.uploadItemImage).mockRejectedValue(
      new Error('file too large')
    )
    const client = new QueryClient()
    const { result } = renderHook(
      () => useUploadMenuItemImage('tenant-1', 'item-1'),
      { wrapper: wrapWithClient(client) }
    )

    result.current.mutate(new File(['x'], 'photo.png', { type: 'image/png' }))

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
