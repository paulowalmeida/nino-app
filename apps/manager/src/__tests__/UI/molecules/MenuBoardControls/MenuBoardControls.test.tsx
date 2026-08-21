import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { MenuBoardControls } from '@molecules/MenuBoardControls/MenuBoardControls'

describe(MenuBoardControls.name, () => {
  it('starts selection from the list controls', async () => {
    const onStartSelection = vi.fn()
    render(
      <MenuBoardControls
        loadedItemCount={2}
        total={2}
        canReorder
        selection={{
          isSelecting: false,
          selectedIds: new Set(),
          onStartSelection,
          onToggleSelection: vi.fn(),
          onToggleAllSelection: vi.fn(),
          onCancelSelection: vi.fn(),
          onRequestBulkDelete: vi.fn(),
        }}
      />
    )

    await userEvent.click(
      screen.getByRole('button', { name: 'Selecionar itens' })
    )

    expect(onStartSelection).toHaveBeenCalledOnce()
    expect(screen.getByText(/^2 itens/)).toBeInTheDocument()
  })

  it('requests bulk deletion only with a selected item', async () => {
    const onRequestBulkDelete = vi.fn()
    render(
      <MenuBoardControls
        loadedItemCount={2}
        total={2}
        canReorder={false}
        selection={{
          isSelecting: true,
          selectedIds: new Set(['item-1']),
          onStartSelection: vi.fn(),
          onToggleSelection: vi.fn(),
          onToggleAllSelection: vi.fn(),
          onCancelSelection: vi.fn(),
          onRequestBulkDelete,
        }}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(screen.getByText('1 selecionado')).toBeInTheDocument()
    expect(onRequestBulkDelete).toHaveBeenCalledOnce()
  })
})
