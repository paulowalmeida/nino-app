import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCatalogCommands } from './useCatalogCommands'

describe(useCatalogCommands.name, () => {
  it('exposes catalog commands backed by query, store, and mutations', async () => {
    const fetchNextPage = vi.fn().mockResolvedValue(undefined)
    const toggleAllItemsSelection = vi.fn()
    const mutations = {
      setAvailability: { mutateAsync: vi.fn() },
      reorderItems: { mutateAsync: vi.fn() },
      deleteItem: { mutateAsync: vi.fn() },
      deleteItems: { mutateAsync: vi.fn() },
    }
    const { result } = renderHook(() => useCatalogCommands(
      { fetchNextPage, items: [{ id: 'item-1' }] } as never,
      { toggleAllItemsSelection } as never,
      mutations as never
    ))

    await result.current.loadMore()
    result.current.toggleAllItemsSelection()
    await result.current.setAvailability({ id: 'item-1', isActive: false })
    await result.current.reorderItems([{ id: 'item-1' }] as never)
    await result.current.deleteItem('item-1')
    await result.current.deleteItems(['item-1'])

    expect(fetchNextPage).toHaveBeenCalledOnce()
    expect(toggleAllItemsSelection).toHaveBeenCalledWith(['item-1'])
    expect(mutations.setAvailability.mutateAsync).toHaveBeenCalled()
    expect(mutations.reorderItems.mutateAsync).toHaveBeenCalled()
    expect(mutations.deleteItem.mutateAsync).toHaveBeenCalledWith('item-1')
    expect(mutations.deleteItems.mutateAsync).toHaveBeenCalledWith(['item-1'])
  })
})
