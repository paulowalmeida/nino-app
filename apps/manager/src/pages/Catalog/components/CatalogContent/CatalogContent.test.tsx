import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CatalogContent } from '@pages/Catalog/components/CatalogContent/CatalogContent'
import { item, secondItem } from '@pages/Catalog/components/CatalogContent/CatalogContent.mock'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'
import type { MenuItem } from '@shared/types/product/menu-item'

vi.mock('@pages/Catalog/facades/useCatalogFacade')

type BoardHarnessProps = {
  items?: MenuItem[]
  tenantRole?: string
  isFetchingNextPage?: boolean
  isSelecting?: boolean
  selectedIds?: Set<string>
  toggleAllItemsSelection?: () => void
  onRequestDelete?: (item: MenuItem) => void
  requestDeleteItems?: (ids: string[]) => void
  cancelSelection?: () => void
}

const BoardHarness = ({
  items = [item],
  tenantRole = 'MANAGER',
  isFetchingNextPage = false,
  isSelecting = false,
  selectedIds = new Set(),
  toggleAllItemsSelection = vi.fn(),
  onRequestDelete = vi.fn(),
  requestDeleteItems = vi.fn(),
  cancelSelection = vi.fn(),
}: BoardHarnessProps) => {
  const catalogState = {
    tenantId: 'tenant-1',
    tenantRole,
    categoryId: 'cat-1',
    search: '',
    items,
    total: items.length,
    status: 'success',
    isFetchingNextPage,
    hasNextPage: false,
    load: vi.fn(),
    loadMore: vi.fn(),
    requestDeleteItems,
    requestDeleteItem: onRequestDelete,
    setAvailability: vi.fn(),
    reorderItems: vi.fn(),
    isSelecting,
    selectedIds,
    toggleItemSelection: vi.fn(),
    toggleAllItemsSelection,
    resetSelection: vi.fn(),
    cancelSelection,
    idsPendingDelete: [],
  }
  vi.mocked(useCatalogFacade).mockReturnValue(
    catalogState as unknown as ReturnType<typeof useCatalogFacade>
  )

  return (
    <MemoryRouter>
      <CatalogContent />
    </MemoryRouter>
  )
}

describe(CatalogContent.name, () => {
  it('requests deletion from the row trash button', async () => {
    // Arrange
    const onRequestDelete = vi.fn()
    render(<BoardHarness onRequestDelete={onRequestDelete} />)

    // Act
    await userEvent.click(screen.getByLabelText('Excluir Coxinha'))

    // Assert
    expect(onRequestDelete).toHaveBeenCalledWith(item)
  })

  it('requests deletion for the selected items', async () => {
    // Arrange
    const requestDeleteItems = vi.fn()
    render(
      <BoardHarness
        isSelecting
        selectedIds={new Set([item.id])}
        requestDeleteItems={requestDeleteItems}
      />
    )

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    // Assert
    expect(requestDeleteItems).toHaveBeenCalledWith(['item-1'])
  })

  it('cancels selection', async () => {
    // Arrange
    const cancelSelection = vi.fn()
    render(
      <BoardHarness
        isSelecting
        selectedIds={new Set([item.id])}
        cancelSelection={cancelSelection}
      />
    )

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    // Assert
    expect(cancelSelection).toHaveBeenCalledOnce()
  })

  it('selects every loaded item through the select-all checkbox', async () => {
    // Arrange
    const toggleAll = vi.fn()
    render(
      <BoardHarness
        items={[item, secondItem]}
        isSelecting
        toggleAllItemsSelection={toggleAll}
      />
    )

    // Act
    await userEvent.click(screen.getByLabelText('Selecionar todos'))

    // Assert
    expect(toggleAll).toHaveBeenCalledOnce()
  })

  it('starts with no selected items', async () => {
    // Arrange / Act
    render(<BoardHarness isSelecting />)

    // Assert
    expect(screen.getByText('0 selecionados')).toBeInTheDocument()
    expect(screen.getByLabelText('Selecionar todos')).toBeInTheDocument()
    expect(screen.queryByLabelText('Desmarcar todos')).not.toBeInTheDocument()
  })

  it('announces when another page is loading', () => {
    // Arrange / Act
    render(<BoardHarness isFetchingNextPage />)

    // Assert
    expect(screen.getByText('Carregando mais itens…')).toBeInTheDocument()
  })
})
