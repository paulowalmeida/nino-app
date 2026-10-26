import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CatalogDeleteItemDialog } from '@pages/Catalog/components/CatalogDeleteItemDialog/CatalogDeleteItemDialog'
import { item } from '@pages/Catalog/components/CatalogDeleteItemDialog/CatalogDeleteItemDialog.mock'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'

vi.mock('@pages/Catalog/facades/useCatalogFacade')

const close = vi.fn()
const remove = vi.fn().mockResolvedValue(undefined)

const renderDialog = () => render(<CatalogDeleteItemDialog />)

describe(CatalogDeleteItemDialog.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCatalogFacade).mockReturnValue({
      unitId: 'unit-1',
      itemPendingDelete: item,
      isDeletingItem: false,
      closeDeleteItem: close,
      deleteItem: remove,
    } as unknown as ReturnType<typeof useCatalogFacade>)
  })

  it('asks before deleting, naming the item', () => {
    // Arrange / Act
    renderDialog()

    // Assert
    expect(screen.getByText('Excluir item')).toBeInTheDocument()
    expect(screen.getByText(/"Coxinha" será removido/)).toBeInTheDocument()
  })

  it('requests deletion only after the confirm button', async () => {
    // Arrange
    renderDialog()

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    // Assert
    expect(remove).toHaveBeenCalledWith('item-1')
  })

  it('closes without requesting deletion when the person backs out', async () => {
    // Arrange
    renderDialog()

    // Act
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    // Assert
    expect(remove).not.toHaveBeenCalled()
    expect(close).toHaveBeenCalled()
  })
})
