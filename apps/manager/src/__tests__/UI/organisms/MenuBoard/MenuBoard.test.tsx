import { useState } from 'react'
import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { MenuItem } from '@custom_types/product/menu-item'
import { MenuBoard } from '@organisms/MenuBoard/MenuBoard'

const item: MenuItem = {
  id: 'item-1',
  name: 'Coxinha',
  description: null,
  price: '8.50',
  position: 1,
  isActive: true,
  category: { id: 'cat-1', name: 'Salgados', position: 0 },
  images: [],
}

const secondItem: MenuItem = { ...item, id: 'item-2', name: 'Pastel' }

type BoardHarnessProps = {
  items?: MenuItem[]
  onRequestDelete?: (item: MenuItem) => void
  onRequestBulkDelete?: () => void
}

const BoardHarness = ({
  items = [item],
  onRequestDelete = vi.fn(),
  onRequestBulkDelete = vi.fn(),
}: BoardHarnessProps) => {
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleSelection = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const cancelSelection = () => {
    setIsSelecting(false)
    setSelectedIds(new Set())
  }

  return (
    <MemoryRouter>
      <MenuBoard
        board={{
          items,
          total: items.length,
          isFetchingNextPage: false,
          canReorder: true,
          loadMoreSentinelRef: vi.fn(),
          onRequestDelete,
          onAvailabilityChange: vi.fn(),
          onReorder: vi.fn(),
        }}
        selection={{
          isSelecting,
          selectedIds,
          onStartSelection: () => setIsSelecting(true),
          onToggleSelection: toggleSelection,
          onToggleAllSelection: () =>
            setSelectedIds(
              selectedIds.size === items.length
                ? new Set()
                : new Set(items.map(({ id }) => id))
            ),
          onCancelSelection: cancelSelection,
          onRequestBulkDelete,
        }}
      />
    </MemoryRouter>
  )
}

describe(MenuBoard.name, () => {
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
    const onRequestBulkDelete = vi.fn()
    render(<BoardHarness onRequestBulkDelete={onRequestBulkDelete} />)

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Selecionar itens' })
    )
    await userEvent.click(screen.getByLabelText('Selecionar Coxinha'))
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    // Assert
    expect(onRequestBulkDelete).toHaveBeenCalledOnce()
  })

  it('cancels selection', async () => {
    // Arrange
    render(<BoardHarness />)

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Selecionar itens' })
    )
    await userEvent.click(screen.getByLabelText('Selecionar Coxinha'))
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    // Assert
    expect(screen.getByLabelText('Excluir Coxinha')).toBeInTheDocument()
  })

  it('selects every loaded item through the select-all checkbox', async () => {
    // Arrange
    render(<BoardHarness items={[item, secondItem]} />)

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Selecionar itens' })
    )
    await userEvent.click(screen.getByLabelText('Selecionar todos'))

    // Assert
    expect(screen.getByText('2 selecionados')).toBeInTheDocument()
    expect(screen.getByLabelText('Desmarcar todos')).toBeInTheDocument()
  })
})
