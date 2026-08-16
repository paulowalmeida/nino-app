import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ProductService } from '@services/product.service'
import {
  DeleteItemsDialog,
} from '@compositions/DeleteItemsDialog/DeleteItemsDialog'

vi.mock('@services/product.service')

const renderDialog = (itemIds: string[], onClose = vi.fn()) => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })

  render(
    <QueryClientProvider client={client}>
      <DeleteItemsDialog
        tenantId="tenant-1"
        itemIds={itemIds}
        onClose={onClose}
      />
    </QueryClientProvider>
  )

  return { onClose }
}

describe(DeleteItemsDialog.name, () => {
  it('asks before deleting, naming the count of selected items', () => {
    // Arrange / Act
    renderDialog(['item-1', 'item-2'])

    // Assert
    expect(screen.getByText('Excluir itens')).toBeInTheDocument()
    expect(screen.getByText(/2 itens serão removidos/)).toBeInTheDocument()
    expect(ProductService.removeItem).not.toHaveBeenCalled()
  })

  it('deletes every selected item only after the confirm button', async () => {
    // Arrange
    vi.mocked(ProductService.removeItem).mockResolvedValue({
      message: 'ok',
    })
    const { onClose } = renderDialog(['item-1', 'item-2'])

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    // Assert
    await waitFor(() =>
      expect(ProductService.removeItem).toHaveBeenCalledWith(
        'tenant-1',
        'item-1'
      )
    )
    expect(ProductService.removeItem).toHaveBeenCalledWith(
      'tenant-1',
      'item-2'
    )
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('closes without deleting when the person backs out', async () => {
    // Arrange
    vi.mocked(ProductService.removeItem).mockClear()
    const { onClose } = renderDialog(['item-1'])

    // Act
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    // Assert
    expect(ProductService.removeItem).not.toHaveBeenCalled()
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
