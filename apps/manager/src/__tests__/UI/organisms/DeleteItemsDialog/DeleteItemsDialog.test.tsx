import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  DeleteItemsDialog,
} from '@organisms/DeleteItemsDialog/DeleteItemsDialog'

const renderDialog = (
  itemIds: string[],
  onClose = vi.fn(),
  onConfirm = vi.fn().mockResolvedValue(undefined)
) => {
  render(
    <DeleteItemsDialog
      itemIds={itemIds}
      isPending={false}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )

  return { onClose, onConfirm }
}

describe(DeleteItemsDialog.name, () => {
  it('asks before deleting, naming the count of selected items', () => {
    // Arrange / Act
    renderDialog(['item-1', 'item-2'])

    // Assert
    expect(screen.getByText('Excluir itens')).toBeInTheDocument()
    expect(screen.getByText(/2 itens serão removidos/)).toBeInTheDocument()
  })

  it('requests deletion only after the confirm button', async () => {
    // Arrange
    const { onConfirm } = renderDialog(['item-1', 'item-2'])

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    // Assert
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('closes without requesting deletion when the person backs out', async () => {
    // Arrange
    const { onClose, onConfirm } = renderDialog(['item-1'])

    // Act
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    // Assert
    expect(onConfirm).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('stays closed with an empty selection', () => {
    // Arrange / Act
    renderDialog([])

    // Assert
    expect(screen.queryByText('Excluir itens')).not.toBeInTheDocument()
    expect(screen.queryByText('Excluir item')).not.toBeInTheDocument()
  })
})
