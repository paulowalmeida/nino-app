import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useItemImages } from '@hooks/product/useItemImages'
import { ProductService } from '@services/product.service'

import { uploadedImage } from './useItemImages.mock'

vi.mock('@services/product.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useItemImages.name, () => {
  it('uploads the file and invalidates the menu on success', async () => {
    // Arrange
    vi.mocked(ProductService.uploadItemImage).mockResolvedValue(
      uploadedImage
    )
    const client = new QueryClient()
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(
      () => useItemImages('tenant-1', 'item-1'),
      { wrapper: wrapWithClient(client) }
    )
    const file = new File(['x'], 'photo.png', { type: 'image/png' })

    // Act
    result.current.upload.mutate(file)
    await waitFor(() => expect(result.current.upload.isSuccess).toBe(true))

    // Assert
    expect(ProductService.uploadItemImage).toHaveBeenCalledWith(
      'tenant-1',
      'item-1',
      file
    )
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['menu', 'tenant-1'],
    })
  })

  it('removes the image and invalidates the menu on success', async () => {
    // Arrange
    vi.mocked(ProductService.removeItemImage).mockResolvedValue({
      message: 'ok',
    })
    const client = new QueryClient()
    const { result } = renderHook(
      () => useItemImages('tenant-1', 'item-1'),
      { wrapper: wrapWithClient(client) }
    )

    // Act
    result.current.remove.mutate('image-1')

    // Assert
    await waitFor(() => expect(result.current.remove.isSuccess).toBe(true))
    expect(ProductService.removeItemImage).toHaveBeenCalledWith(
      'tenant-1',
      'item-1',
      'image-1'
    )
  })

  it('surfaces upload failure through isError', async () => {
    // Arrange
    vi.mocked(ProductService.uploadItemImage).mockRejectedValue(
      new Error('file too large')
    )
    const client = new QueryClient()
    const { result } = renderHook(
      () => useItemImages('tenant-1', 'item-1'),
      { wrapper: wrapWithClient(client) }
    )
    const file = new File(['x'], 'photo.png', { type: 'image/png' })

    // Act
    result.current.upload.mutate(file)

    // Assert
    await waitFor(() => expect(result.current.upload.isError).toBe(true))
  })
})
