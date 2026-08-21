import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  DeleteCategoryDialog,
} from '@organisms/DeleteCategoryDialog/DeleteCategoryDialog'
import {
  categoryWithProducts,
  emptyCategory,
} from './DeleteCategoryDialog.mock'

const renderDialog = (
  category: typeof emptyCategory | null,
  onClose = vi.fn(),
  onConfirm = vi.fn().mockResolvedValue(undefined),
  onViewItems = vi.fn(),
  error: string | null = null
) => {
  render(
    <DeleteCategoryDialog
      category={category}
      isPending={false}
      error={error}
      onConfirm={onConfirm}
      onViewItems={onViewItems}
      onClose={onClose}
    />
  )

  return { onClose, onConfirm, onViewItems }
}

describe(DeleteCategoryDialog.name, () => {
  it('asks before deleting an empty category', () => {
    // Arrange / Act
    renderDialog(emptyCategory)

    // Assert
    expect(screen.getByText('Excluir "Sobremesas"')).toBeInTheDocument()
  })

  it('requests deletion only after the confirm button', async () => {
    // Arrange
    const { onConfirm } = renderDialog(emptyCategory)

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    // Assert
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('blocks deletion and warns for a category with products', () => {
    // Arrange / Act
    renderDialog(categoryWithProducts)

    // Assert
    expect(
      screen.getByText('Ainda não dá para excluir')
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Excluir "Lanches"')
    ).not.toBeInTheDocument()
  })

  it('shows an error received from the container', () => {
    renderDialog(
      emptyCategory,
      vi.fn(),
      vi.fn().mockResolvedValue(undefined),
      vi.fn(),
      'Não foi possível excluir. Tente de novo.'
    )

    expect(
      screen.getByText('Não foi possível excluir. Tente de novo.')
    ).toBeInTheDocument()
  })
})
