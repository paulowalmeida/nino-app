import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CatalogDeleteItemsDialog } from '@pages/Catalog/components/CatalogDeleteItemsDialog/CatalogDeleteItemsDialog'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'

vi.mock('@pages/Catalog/facades/useCatalogFacade')

const close = vi.fn()
const remove = vi.fn().mockResolvedValue(undefined)
let itemIds = ['item-1', 'item-2']

const renderDialog = () => render(<CatalogDeleteItemsDialog />)

describe(CatalogDeleteItemsDialog.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCatalogFacade).mockImplementation(() => ({
      tenantId: 'tenant-1',
      idsPendingDelete: itemIds,
      isDeletingItems: false,
      closeDeleteItems: close,
      deleteItems: remove,
    }) as unknown as ReturnType<typeof useCatalogFacade>)
  })

  it('asks before deleting, naming the count of selected items', () => {
    // Arrange / Act
    itemIds = ['item-1', 'item-2']
    renderDialog()

    // Assert
    expect(screen.getByText('Excluir itens')).toBeInTheDocument()
    expect(screen.getByText(/2 itens serão removidos/)).toBeInTheDocument()
  })

  it('requests deletion only after the confirm button', async () => {
    // Arrange
    itemIds = ['item-1', 'item-2']
    renderDialog()

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    // Assert
    expect(remove).toHaveBeenCalledWith(['item-1', 'item-2'])
  })

  it('closes without requesting deletion when the person backs out', async () => {
    // Arrange
    itemIds = ['item-1']
    renderDialog()

    // Act
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    // Assert
    expect(remove).not.toHaveBeenCalled()
    expect(close).toHaveBeenCalled()
  })

  it('stays closed with an empty selection', () => {
    // Arrange / Act
    itemIds = []
    renderDialog()

    // Assert
    expect(screen.queryByText('Excluir itens')).not.toBeInTheDocument()
    expect(screen.queryByText('Excluir item')).not.toBeInTheDocument()
  })
})
