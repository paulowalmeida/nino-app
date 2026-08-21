import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { MenuItem } from '@custom_types/product/menu-item'
import { DeleteItemDialog } from '@organisms/DeleteItemDialog/DeleteItemDialog'

const item = {
  id: 'item-1',
  name: 'Coxinha',
  description: null,
  price: '8.50',
  position: 0,
  isActive: true,
  category: { id: 'cat-1', name: 'Salgados', position: 0 },
  images: [],
} as MenuItem

const renderDialog = (
  onClose = vi.fn(),
  onConfirm = vi.fn().mockResolvedValue(undefined)
) => {
  render(
    <DeleteItemDialog
      item={item}
      isPending={false}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )

  return { onClose, onConfirm }
}

describe(DeleteItemDialog.name, () => {
  it('asks before deleting, naming the item', () => {
    // Arrange / Act
    renderDialog()

    // Assert
    expect(screen.getByText('Excluir item')).toBeInTheDocument()
    expect(screen.getByText(/"Coxinha" será removido/)).toBeInTheDocument()
  })

  it('requests deletion only after the confirm button', async () => {
    // Arrange
    const { onConfirm } = renderDialog()

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    // Assert
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('closes without requesting deletion when the person backs out', async () => {
    // Arrange
    const { onClose, onConfirm } = renderDialog()

    // Act
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    // Assert
    expect(onConfirm).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})
