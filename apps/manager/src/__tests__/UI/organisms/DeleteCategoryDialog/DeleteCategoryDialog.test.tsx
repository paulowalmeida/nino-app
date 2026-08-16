import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import {
  DeleteCategoryDialog,
} from '@organisms/DeleteCategoryDialog/DeleteCategoryDialog'
import { CategoryService } from '@services/category.service'

import {
  categoryWithProducts,
  emptyCategory,
} from './DeleteCategoryDialog.mock'

vi.mock('@services/category.service')

const renderDialog = (
  category: typeof emptyCategory | null,
  onClose = vi.fn(),
  onPendingChange = vi.fn()
) => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })

  render(
    <MemoryRouter>
      <QueryClientProvider client={client}>
        <DeleteCategoryDialog
          tenantId="tenant-1"
          category={category}
          onClose={onClose}
          onPendingChange={onPendingChange}
        />
      </QueryClientProvider>
    </MemoryRouter>
  )

  return { onClose, onPendingChange }
}

describe(DeleteCategoryDialog.name, () => {
  it('asks before deleting an empty category', () => {
    // Arrange / Act
    renderDialog(emptyCategory)

    // Assert
    expect(screen.getByText('Excluir "Sobremesas"')).toBeInTheDocument()
    expect(CategoryService.removeCategory).not.toHaveBeenCalled()
  })

  it('deletes only after the confirm button', async () => {
    // Arrange
    vi.mocked(CategoryService.removeCategory).mockResolvedValue({
      message: 'Categoria excluída',
    })
    const { onClose } = renderDialog(emptyCategory)

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    // Assert
    await waitFor(() =>
      expect(CategoryService.removeCategory).toHaveBeenCalledWith(
        'tenant-1',
        'cat-1'
      )
    )
    await waitFor(() => expect(onClose).toHaveBeenCalled())
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

  it('reports pending state while the request is in flight', async () => {
    // Arrange
    let resolveRemove: (value: { message: string }) => void = () => {}
    vi.mocked(CategoryService.removeCategory).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRemove = resolve
        })
    )
    const { onPendingChange } = renderDialog(emptyCategory)

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    // Assert
    await waitFor(() => expect(onPendingChange).toHaveBeenCalledWith(true))
    resolveRemove({ message: 'Categoria excluída' })
    await waitFor(() => expect(onPendingChange).toHaveBeenCalledWith(false))
  })

  it('shows a generic error when the delete request fails', async () => {
    // Arrange
    vi.mocked(CategoryService.removeCategory).mockRejectedValue(
      new Error('network error')
    )
    renderDialog(emptyCategory)

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    // Assert
    await waitFor(() =>
      expect(
        screen.getByText('Não foi possível excluir. Tente de novo.')
      ).toBeInTheDocument()
    )
  })
})
