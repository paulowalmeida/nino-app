import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CatalogControls } from '@pages/Catalog/components/CatalogContent/CatalogControls/CatalogControls'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'

vi.mock('@pages/Catalog/facades/useCatalogFacade')

describe(CatalogControls.name, () => {
  const requestDeleteItems = vi.fn()
  const startSelection = vi.fn()
  const cancelSelection = vi.fn()
  const toggleAllItemsSelection = vi.fn()

  beforeEach(() => {
    vi.mocked(useCatalogFacade).mockReturnValue({
      total: 2,
      canManageCatalog: true,
      categoryId: 'cat-1',
      search: '',
      items: [{ id: 'item-1' }, { id: 'item-2' }],
      isSelecting: false,
      selectedIds: new Set(),
      startSelection,
      cancelSelection,
      toggleAllItemsSelection,
      requestDeleteItems,
    } as unknown as ReturnType<typeof useCatalogFacade>)
  })

  it('starts selection from the list controls', async () => {
    render(<CatalogControls />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Selecionar itens' })
    )

    expect(startSelection).toHaveBeenCalledOnce()
    expect(screen.getByText(/^2 itens/)).toBeInTheDocument()
  })

  it('requests bulk deletion only with a selected item', async () => {
    vi.mocked(useCatalogFacade).mockReturnValue({
      isSelecting: true,
      selectedIds: new Set(['item-1']),
      startSelection: vi.fn(),
      cancelSelection: vi.fn(),
      toggleAllItemsSelection: vi.fn(),
      requestDeleteItems,
      total: 2,
      canManageCatalog: true,
      categoryId: 'cat-1',
      search: '',
      items: [{ id: 'item-1' }, { id: 'item-2' }],
    } as unknown as ReturnType<typeof useCatalogFacade>)
    render(<CatalogControls />)

    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(screen.getByText('1 selecionado')).toBeInTheDocument()
    expect(requestDeleteItems).toHaveBeenCalledWith(['item-1'])
  })

  it('delegates select-all from a partial selection', async () => {
    // Arrange
    const toggleAllItemsSelection = vi.fn()
    const user = userEvent.setup()
    vi.mocked(useCatalogFacade).mockReturnValue({
      isSelecting: true,
      selectedIds: new Set(['item-1']),
      startSelection: vi.fn(),
      cancelSelection: vi.fn(),
      toggleAllItemsSelection,
      requestDeleteItems,
      total: 2,
      canManageCatalog: true,
      categoryId: 'cat-1',
      search: '',
      items: [{ id: 'item-1' }, { id: 'item-2' }],
    } as unknown as ReturnType<typeof useCatalogFacade>)
    render(<CatalogControls />)

    // Act
    await user.click(
      screen.getByRole('checkbox', { name: 'Selecionar todos' })
    )

    // Assert
    expect(toggleAllItemsSelection).toHaveBeenCalledOnce()
  })

  it('hides the selection controls from a role that cannot manage', () => {
    // Arrange
    vi.mocked(useCatalogFacade).mockReturnValue({
      total: 2,
      canManageCatalog: false,
      categoryId: 'cat-1',
      search: '',
      items: [{ id: 'item-1' }, { id: 'item-2' }],
      isSelecting: false,
      selectedIds: new Set(),
      startSelection,
      cancelSelection,
      toggleAllItemsSelection,
      requestDeleteItems,
    } as unknown as ReturnType<typeof useCatalogFacade>)

    // Act
    render(<CatalogControls />)

    // Assert
    expect(
      screen.queryByRole('button', { name: 'Selecionar itens' })
    ).not.toBeInTheDocument()
    expect(screen.getByText('2 itens')).toBeInTheDocument()
  })
})
