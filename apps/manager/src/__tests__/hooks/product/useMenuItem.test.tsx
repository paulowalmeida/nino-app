import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useMenuItem } from '@hooks/product/useMenuItem'
import { ProductService } from '@services/product.service'

import { menuWithPizza } from './useMenuItem.mock'

vi.mock('@services/product.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useMenuItem.name, () => {
  it('finds the item and derives categories from the cached menu', async () => {
    // Arrange
    vi.mocked(ProductService.listMenu).mockResolvedValue(menuWithPizza)
    const client = new QueryClient()

    // Act
    const { result } = renderHook(
      () => useMenuItem('tenant-1', 'item-1'),
      { wrapper: wrapWithClient(client) }
    )

    // Assert
    await waitFor(() => expect(result.current.item?.name).toBe('Pizza'))
    expect(result.current.categories).toEqual([
      { value: 'cat-a', label: 'Lanches' },
    ])
  })

  it('returns null with no matching product id', async () => {
    // Arrange
    vi.mocked(ProductService.listMenu).mockResolvedValue(menuWithPizza)
    const client = new QueryClient()

    // Act
    const { result } = renderHook(
      () => useMenuItem('tenant-1', 'missing-id'),
      { wrapper: wrapWithClient(client) }
    )

    // Assert
    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.item).toBeNull()
  })

  it('returns null with no product id at all', () => {
    // Arrange / Act
    const client = new QueryClient()
    const { result } = renderHook(
      () => useMenuItem('tenant-1', undefined),
      { wrapper: wrapWithClient(client) }
    )

    // Assert
    expect(result.current.item).toBeNull()
  })
})
