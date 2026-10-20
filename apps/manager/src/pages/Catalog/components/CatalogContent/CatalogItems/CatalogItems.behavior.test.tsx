import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CatalogItems } from '@pages/Catalog/components/CatalogContent/CatalogItems/CatalogItems'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'
import type { MenuItem } from '@shared/types/product/menu-item'

vi.mock('@pages/Catalog/facades/useCatalogFacade')
let loadMoreCallback: (() => void) | undefined
vi.mock('@shared/hooks/ui/useLoadMore/useLoadMore', () => ({
  useLoadMore: (_hasNextPage: boolean, callback: () => void) => {
    loadMoreCallback = callback
    return () => undefined
  },
}))
vi.mock(
  '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRow',
  () => ({
    MenuRow: ({
      item,
      onToggleAvailability,
      onDelete,
      onDragEnd,
    }: {
      item: MenuItem
      onToggleAvailability: (id: string, isActive: boolean) => void
      onDelete: (item: MenuItem) => void
      onDragEnd: () => void
    }) => (
      <div>
        <span>{item.name}</span>
        <button onClick={() => onToggleAvailability(item.id, false)}>
          disponibilidade
        </button>
        <button onClick={() => onDelete(item)}>excluir</button>
        <button onClick={onDragEnd}>arrastar</button>
      </div>
    ),
  })
)
vi.mock('framer-motion', () => ({
  Reorder: {
    Group: ({
      values,
      onReorder,
      children,
    }: {
      values: MenuItem[]
      onReorder: (values: MenuItem[]) => void
      children: ReactNode
    }) => (
      <div>
        <button onClick={() => onReorder([...values].reverse())}>
          reordenar
        </button>
        {children}
      </div>
    ),
  },
}))

const item = { id: 'item-1', name: 'Coxinha' } as MenuItem
const secondItem = { id: 'item-2', name: 'Pastel' } as MenuItem

describe('CatalogItems behavior', () => {
  let currentItems: MenuItem[]
  const resetSelection = vi.fn()
  const setAvailability = vi.fn()
  const requestDeleteItem = vi.fn()
  const reorderItems = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    loadMoreCallback = undefined
    currentItems = [item, secondItem]
    vi.mocked(useCatalogFacade).mockImplementation(
      () =>
        ({
          categoryId: 'cat-1',
          canManageCatalog: true,
          search: '',
          items: currentItems,
          isFetchingNextPage: false,
          hasNextPage: false,
          loadMore: vi.fn(),
          isSelecting: false,
          selectedIds: new Set(),
          toggleItemSelection: vi.fn(),
          requestDeleteItem,
          setAvailability,
          reorderItems,
          resetSelection,
        }) as unknown as ReturnType<typeof useCatalogFacade>
    )
  })

  it('forwards row actions and submits the locally reordered items', async () => {
    const user = userEvent.setup()
    render(<CatalogItems />)

    await user.click(
      screen.getAllByRole('button', { name: 'disponibilidade' })[0]
    )
    await user.click(screen.getAllByRole('button', { name: 'excluir' })[0])
    await user.click(screen.getByRole('button', { name: 'reordenar' }))
    await user.click(screen.getAllByRole('button', { name: 'arrastar' })[0])

    expect(setAvailability).toHaveBeenCalledWith({
      id: 'item-1',
      isActive: false,
    })
    expect(requestDeleteItem).toHaveBeenCalledWith(item)
    expect(reorderItems).toHaveBeenCalledWith([secondItem, item])
  })

  it('loads the next page through the sentinel callback', () => {
    const loadMore = vi.fn()
    vi.mocked(useCatalogFacade).mockImplementation(
      () =>
        ({
          categoryId: 'cat-1',
          search: '',
          items: currentItems,
          isFetchingNextPage: false,
          hasNextPage: true,
          loadMore,
          isSelecting: false,
          selectedIds: new Set(),
          toggleItemSelection: vi.fn(),
          requestDeleteItem,
          setAvailability,
          reorderItems,
          resetSelection,
        }) as unknown as ReturnType<typeof useCatalogFacade>
    )

    render(<CatalogItems />)
    loadMoreCallback?.()

    expect(loadMore).toHaveBeenCalledOnce()
  })

  it('resets selection when a new query result arrives', () => {
    const { rerender } = render(<CatalogItems />)
    currentItems = [{ ...item, id: 'item-3', name: 'Açaí' }]

    rerender(<CatalogItems />)

    expect(resetSelection).toHaveBeenCalledOnce()
  })
})
