import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCatalog } from '@hooks/product/useCatalog'
import { ProductService } from '@services/product.service'

import { fullFirstPage, itemA, itemB, lastPage } from './useCatalog.mock'

vi.mock('@services/product.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useCatalog.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('flattens the first page of items', async () => {
    // Arrange
    vi.mocked(ProductService.listProducts).mockResolvedValue(fullFirstPage)

    // Act
    const { result } = renderHook(
      () => useCatalog('tenant-1', { categoryId: null, search: '' }),
      { wrapper: wrapWithClient() }
    )

    // Assert
    await waitFor(() => expect(result.current.items).toEqual([itemA, itemB]))
    expect(result.current.total).toBe(3)
  })

  it('reports another page while fewer items than the total loaded', async () => {
    // Arrange
    vi.mocked(ProductService.listProducts).mockResolvedValue(fullFirstPage)
    const { result } = renderHook(
      () => useCatalog('tenant-1', { categoryId: null, search: '' }),
      { wrapper: wrapWithClient() }
    )
    await waitFor(() => expect(result.current.items).toHaveLength(2))

    // Act
    vi.mocked(ProductService.listProducts).mockResolvedValue(lastPage)
    await result.current.fetchNextPage()

    // Assert
    await waitFor(() => expect(result.current.items).toHaveLength(3))
    expect(result.current.hasNextPage).toBe(false)
  })

  it('stays disabled with no tenant', () => {
    // Arrange / Act
    const { result } = renderHook(
      () => useCatalog(null, { categoryId: null, search: '' }),
      { wrapper: wrapWithClient() }
    )

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(ProductService.listProducts).not.toHaveBeenCalled()
  })
})
