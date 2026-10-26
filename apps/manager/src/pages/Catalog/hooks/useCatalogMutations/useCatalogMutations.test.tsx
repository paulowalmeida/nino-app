import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useCatalogMutations } from '@pages/Catalog/hooks/useCatalogMutations/useCatalogMutations'
import { ProductService } from '@shared/services/product/product.service'
import type { MenuItem } from '@shared/types/product/menu-item'

vi.mock('@shared/services/product/product.service', () => ({
  ProductService: {
    setItemAvailability: vi.fn(),
    reorderItems: vi.fn(),
    removeItem: vi.fn(),
    removeItems: vi.fn(),
  },
}))

const createHarness = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return { queryClient, wrapper }
}

describe(useCatalogMutations.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('updates availability and invalidates the unit product cache', async () => {
    vi.mocked(ProductService.setItemAvailability).mockResolvedValue(
      {} as MenuItem
    )
    const { queryClient, wrapper } = createHarness()
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCatalogMutations('unit-1'), {
      wrapper,
    })

    await act(() =>
      result.current.setAvailability.mutateAsync({
        id: 'item-1',
        isActive: false,
      })
    )

    expect(ProductService.setItemAvailability).toHaveBeenCalledWith(
      'unit-1',
      'item-1',
      false
    )
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['products', 'unit-1'],
    })
  })

  it('sends the reordered item IDs to the backend', async () => {
    vi.mocked(ProductService.reorderItems).mockResolvedValue({ message: 'ok' })
    const { wrapper } = createHarness()
    const items = [{ id: 'item-2' }, { id: 'item-1' }] as MenuItem[]
    const { result } = renderHook(() => useCatalogMutations('unit-1'), {
      wrapper,
    })

    await act(() => result.current.reorderItems.mutateAsync(items))

    expect(ProductService.reorderItems).toHaveBeenCalledWith('unit-1', [
      'item-2',
      'item-1',
    ])
  })

  it('supports single and bulk item deletion', async () => {
    vi.mocked(ProductService.removeItem).mockResolvedValue({ message: 'ok' })
    vi.mocked(ProductService.removeItems).mockResolvedValue({
      message: 'ok',
      count: 2,
    })
    const { wrapper } = createHarness()
    const { result } = renderHook(() => useCatalogMutations('unit-1'), {
      wrapper,
    })

    await act(() => result.current.deleteItem.mutateAsync('item-1'))
    await act(() =>
      result.current.deleteItems.mutateAsync(['item-1', 'item-2'])
    )

    expect(ProductService.removeItem).toHaveBeenCalledWith('unit-1', 'item-1')
    expect(ProductService.removeItems).toHaveBeenCalledWith('unit-1', [
      'item-1',
      'item-2',
    ])
  })

  it('keeps the empty unit scope when invalidating after a mutation', async () => {
    vi.mocked(ProductService.setItemAvailability).mockResolvedValue(
      {} as unknown as MenuItem
    )
    const { queryClient, wrapper } = createHarness()
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCatalogMutations(null), { wrapper })

    await act(() =>
      result.current.setAvailability.mutateAsync({
        id: 'item-1',
        isActive: true,
      })
    )

    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['products', ''],
    })
  })
})
