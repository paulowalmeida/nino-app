import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { MenuItem } from '@custom_types/product/menu-item'
import { ProductService } from '@services/product.service'
import { DeleteItemDialog } from '@compositions/MenuBoard/DeleteItemDialog/DeleteItemDialog'

vi.mock('@services/product.service')

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

const renderDialog = (onClose = vi.fn()) => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })

  render(
    <QueryClientProvider client={client}>
      <DeleteItemDialog tenantId="tenant-1" item={item} onClose={onClose} />
    </QueryClientProvider>
  )

  return { onClose }
}

describe(DeleteItemDialog.name, () => {
  it('asks before deleting, naming the item', () => {
    // Arrange / Act
    renderDialog()

    // Assert
    expect(screen.getByText('Excluir item')).toBeInTheDocument()
    expect(screen.getByText(/"Coxinha" será removido/)).toBeInTheDocument()
    expect(ProductService.removeItem).not.toHaveBeenCalled()
  })

  it('deletes only after the confirm button', async () => {
    // Arrange
    vi.mocked(ProductService.removeItem).mockResolvedValue({
      message: 'Item removido',
    })
    const { onClose } = renderDialog()

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    // Assert
    await waitFor(() =>
      expect(ProductService.removeItem).toHaveBeenCalledWith(
        'tenant-1',
        'item-1'
      )
    )
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('closes without deleting when the person backs out', async () => {
    // Arrange
    vi.mocked(ProductService.removeItem).mockClear()
    const { onClose } = renderDialog()

    // Act
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    // Assert
    expect(ProductService.removeItem).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})
