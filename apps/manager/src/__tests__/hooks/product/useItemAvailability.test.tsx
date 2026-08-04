import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { MenuItem, MenuPage } from '@custom_types/product'
import { useItemAvailability } from '@hooks/product/useItemAvailability'
import { ProductService } from '@services/product.service'

import { catalogPages, menuPage } from './useItemAvailability.mock'

vi.mock('@services/product.service')

const menuKey = ['menu', 'tenant-1']
const catalogKey = ['products', 'tenant-1']

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useItemAvailability.name, () => {
  it('patches the item in both caches optimistically', async () => {
    // Arrange
    vi.mocked(ProductService.setItemAvailability).mockResolvedValue(
      {} as unknown as MenuItem
    )
    const client = new QueryClient()
    client.setQueryData(menuKey, menuPage)
    client.setQueryData(catalogKey, catalogPages)
    const { result } = renderHook(() => useItemAvailability('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ id: 'item-1', isActive: false })

    // Assert
    await waitFor(() => {
      const menu = client.getQueryData<MenuPage>(menuKey)
      expect(menu?.data.find((item) => item.id === 'item-1')?.isActive).toBe(
        false
      )
    })
    const catalog = client.getQueryData<typeof catalogPages>(catalogKey)
    expect(
      catalog?.pages[0]?.data.find((item) => item.id === 'item-1')?.isActive
    ).toBe(false)
  })

  it('rolls back both caches when the request fails', async () => {
    // Arrange
    vi.mocked(ProductService.setItemAvailability).mockRejectedValue(
      new Error('network error')
    )
    const client = new QueryClient()
    client.setQueryData(menuKey, menuPage)
    client.setQueryData(catalogKey, catalogPages)
    const { result } = renderHook(() => useItemAvailability('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ id: 'item-1', isActive: false })
    await waitFor(() => expect(result.current.isError).toBe(true))

    // Assert
    const menu = client.getQueryData<MenuPage>(menuKey)
    expect(menu?.data.find((item) => item.id === 'item-1')?.isActive).toBe(
      true
    )
  })
})
