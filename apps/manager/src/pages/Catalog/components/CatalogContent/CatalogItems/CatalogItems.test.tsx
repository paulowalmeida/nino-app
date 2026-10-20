import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CatalogItems } from '@pages/Catalog/components/CatalogContent/CatalogItems/CatalogItems'
import {
  item,
  secondItem,
} from '@pages/Catalog/components/CatalogContent/CatalogItems/CatalogItems.mock'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'

vi.mock('@pages/Catalog/facades/useCatalogFacade')

type CatalogItemsHarness = {
  items: (typeof item)[]
  isFetchingNextPage: boolean
  isSelecting: boolean
  selectedIds: Set<string>
  onToggleSelection: ReturnType<typeof vi.fn>
  onRequestDelete: ReturnType<typeof vi.fn>
}

const renderList = (overrides: Partial<CatalogItemsHarness> = {}) => {
  const props: CatalogItemsHarness = {
    items: [item],
    isFetchingNextPage: false,
    isSelecting: false,
    selectedIds: new Set(),
    onToggleSelection: vi.fn(),
    onRequestDelete: vi.fn(),
    ...overrides,
  }

  vi.mocked(useCatalogFacade).mockReturnValue({
    categoryId: 'cat-1',
    canManageCatalog: true,
    search: '',
    items: props.items,
    isFetchingNextPage: props.isFetchingNextPage,
    hasNextPage: false,
    loadMore: vi.fn(),
    isSelecting: props.isSelecting,
    selectedIds: props.selectedIds,
    toggleItemSelection: props.onToggleSelection,
    requestDeleteItem: props.onRequestDelete,
    setAvailability: vi.fn(),
    reorderItems: vi.fn(),
    resetSelection: vi.fn(),
  } as unknown as ReturnType<typeof useCatalogFacade>)

  render(
    <MemoryRouter>
      <CatalogItems />
    </MemoryRouter>
  )

  return props
}

describe(CatalogItems.name, () => {
  it('renders the loaded items and forwards row deletion', async () => {
    const user = userEvent.setup()
    const props = renderList({ items: [item, secondItem] })

    expect(screen.getByText('Coxinha')).toBeInTheDocument()
    expect(screen.getByText('Pastel')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Excluir Coxinha'))

    expect(props.onRequestDelete).toHaveBeenCalledWith(item)
  })

  it('forwards selection changes while selecting items', async () => {
    const user = userEvent.setup()
    const props = renderList({ isSelecting: true })

    await user.click(screen.getByLabelText('Selecionar Coxinha'))

    expect(props.onToggleSelection).toHaveBeenCalledWith(item.id)
  })

  it('announces when another page is loading', () => {
    renderList({ isFetchingNextPage: true })

    expect(screen.getByText('Carregando mais itens…')).toBeInTheDocument()
  })
})
