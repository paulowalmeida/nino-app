import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'
import { useCatalogCategoriesQuery } from '@pages/Catalog/hooks/useCatalogCategoriesQuery/useCatalogCategoriesQuery'
import { useCatalogCommands } from '@pages/Catalog/hooks/useCatalogCommands/useCatalogCommands'
import { useCatalogMutations } from '@pages/Catalog/hooks/useCatalogMutations/useCatalogMutations'
import { useCatalogQuery } from '@pages/Catalog/hooks/useCatalogQuery/useCatalogQuery'
import { useCatalogStore } from '@pages/Catalog/states/catalog/catalog.store'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import type { MenuItem } from '@shared/types/product/menu-item'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock('@pages/Catalog/hooks/useCatalogCategoriesQuery/useCatalogCategoriesQuery')
vi.mock('@pages/Catalog/hooks/useCatalogCommands/useCatalogCommands')
vi.mock('@pages/Catalog/hooks/useCatalogMutations/useCatalogMutations')
vi.mock('@pages/Catalog/hooks/useCatalogQuery/useCatalogQuery')
vi.mock('@pages/Catalog/states/catalog/catalog.store')

describe(useCatalogFacade.name, () => {
  const fetchNextPage = vi.fn()
  const toggleAllItemsSelection = vi.fn()
  const setAvailability = vi.fn()
  const reorderItems = vi.fn()
  const deleteItem = vi.fn()
  const deleteItems = vi.fn()
  const facadeToggleAllItemsSelection = vi.fn()
  const commands = {
    loadMore: fetchNextPage,
    toggleAllItemsSelection: facadeToggleAllItemsSelection,
    setAvailability,
    reorderItems,
    deleteItem,
    deleteItems,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCurrentUnit).mockReturnValue({
      unitId: 'unit-1',
      permissions: ['catalog.manage'],
    } as ReturnType<typeof useCurrentUnit>)
    vi.mocked(useCatalogStore).mockReturnValue({
      categoryId: 'cat-1',
      search: 'burger',
      selectedIds: new Set(['item-1']),
      toggleAllItemsSelection,
    } as unknown as ReturnType<typeof useCatalogStore>)
    vi.mocked(useCatalogQuery).mockReturnValue({
      fetchNextPage,
      items: [{ id: 'item-1' }],
      total: 1,
      status: 'success',
      isFetchingNextPage: false,
      hasNextPage: false,
    } as unknown as ReturnType<typeof useCatalogQuery>)
    vi.mocked(useCatalogCategoriesQuery).mockReturnValue({
      categories: [],
      status: 'success',
    } as unknown as ReturnType<typeof useCatalogCategoriesQuery>)
    vi.mocked(useCatalogMutations).mockReturnValue({
      setAvailability: { isPending: false, mutateAsync: setAvailability },
      reorderItems: { mutateAsync: reorderItems },
      deleteItem: { isPending: false, mutateAsync: deleteItem },
      deleteItems: { isPending: false, mutateAsync: deleteItems },
    } as unknown as ReturnType<typeof useCatalogMutations>)
    vi.mocked(useCatalogCommands).mockReturnValue(commands as never)
  })

  it('exposes view data and delegates catalog commands through the facade', async () => {
    const { result } = renderHook(() => useCatalogFacade())

    expect(result.current.unitId).toBe('unit-1')
    expect(result.current.status).toBe('success')
    expect(result.current.items).toEqual([{ id: 'item-1' }])
    expect(result.current.total).toBe(1)

    await result.current.loadMore()
    result.current.toggleAllItemsSelection()
    await result.current.setAvailability({ id: 'item-1', isActive: false })
    await result.current.reorderItems([{ id: 'item-1' }] as MenuItem[])
    await result.current.deleteItem('item-1')
    await result.current.deleteItems(['item-1'])

    expect(fetchNextPage).toHaveBeenCalledOnce()
    expect(facadeToggleAllItemsSelection).toHaveBeenCalledOnce()
    expect(setAvailability).toHaveBeenCalledWith({
      id: 'item-1',
      isActive: false,
    })
    expect(reorderItems).toHaveBeenCalledWith([{ id: 'item-1' }])
    expect(deleteItem).toHaveBeenCalledWith('item-1')
    expect(deleteItems).toHaveBeenCalledWith(['item-1'])
  })

  it('reports idle while no unit is available', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(null)
    vi.mocked(useCatalogQuery).mockReturnValue({
      status: 'idle',
    } as unknown as ReturnType<typeof useCatalogQuery>)
    vi.mocked(useCatalogCategoriesQuery).mockReturnValue({
      status: 'idle',
      categories: [],
    } as unknown as ReturnType<typeof useCatalogCategoriesQuery>)

    const { result } = renderHook(() => useCatalogFacade())

    expect(result.current.status).toBe('idle')
    expect(result.current.categoriesStatus).toBe('idle')
  })

  it('reports loading while an enabled query is pending', () => {
    vi.mocked(useCatalogQuery).mockReturnValue({
      status: 'loading',
    } as unknown as ReturnType<typeof useCatalogQuery>)
    vi.mocked(useCatalogCategoriesQuery).mockReturnValue({
      status: 'loading',
      categories: [],
    } as unknown as ReturnType<typeof useCatalogCategoriesQuery>)

    const { result } = renderHook(() => useCatalogFacade())

    expect(result.current.status).toBe('loading')
    expect(result.current.categoriesStatus).toBe('loading')
  })
})
