import { MemoryRouter } from 'react-router'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { MenuItem } from '@custom_types/product/menu-item'
import { useCatalog } from '@hooks/product/useCatalog'
import { MenuBoard } from '@templates/MenuBoard/MenuBoard'

vi.mock('@hooks/product/useCatalog')
vi.mock('@hooks/product/useItemAvailability', () => ({
  useItemAvailability: () => ({ mutate: vi.fn() }),
}))
vi.mock('@hooks/product/useReorderMenuItems', () => ({
  useReorderMenuItems: () => ({ mutate: vi.fn() }),
}))
vi.mock('@services/product.service')

const item: MenuItem = {
  id: 'item-1',
  name: 'Coxinha',
  description: null,
  price: '8.50',
  position: 1,
  isActive: true,
  category: { id: 'cat-1', name: 'Salgados', position: 0 },
  images: [],
}

const secondItem: MenuItem = {
  ...item,
  id: 'item-2',
  name: 'Pastel',
}

const renderBoard = () => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })

  return render(
    <MemoryRouter>
      <QueryClientProvider client={client}>
        <MenuBoard tenantId="tenant-1" categoryId="cat-1" search="" />
      </QueryClientProvider>
    </MemoryRouter>
  )
}

describe(MenuBoard.name, () => {
  beforeEach(() => {
    vi.mocked(useCatalog).mockReturnValue({
      items: [item],
      total: 1,
      isPending: false,
      isError: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
    } as unknown as ReturnType<typeof useCatalog>)
  })

  it('opens the confirmation dialog from the row trash button', async () => {
    // Arrange
    renderBoard()

    // Act
    await userEvent.click(screen.getByLabelText('Excluir Coxinha'))

    // Assert
    expect(screen.getByText('Excluir item')).toBeInTheDocument()
    expect(screen.getByText(/"Coxinha" será removido/)).toBeInTheDocument()
  })

  it('enters selection mode and opens the bulk delete dialog', async () => {
    // Arrange
    renderBoard()

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Selecionar itens' })
    )
    await userEvent.click(screen.getByLabelText('Selecionar Coxinha'))
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    // Assert
    expect(screen.getByText('Excluir item')).toBeInTheDocument()
    expect(screen.getByText(/1 item será removido/)).toBeInTheDocument()
    expect(
      screen.queryByLabelText('Excluir Coxinha')
    ).not.toBeInTheDocument()
  })

  it('cancels selection without opening the bulk delete dialog', async () => {
    // Arrange
    renderBoard()

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Selecionar itens' })
    )
    await userEvent.click(screen.getByLabelText('Selecionar Coxinha'))
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    // Assert
    expect(screen.queryByText('Excluir itens')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Excluir Coxinha')).toBeInTheDocument()
  })

  it('selects every loaded item through the select-all checkbox', async () => {
    // Arrange
    vi.mocked(useCatalog).mockReturnValue({
      items: [item, secondItem],
      total: 2,
      isPending: false,
      isError: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
    } as unknown as ReturnType<typeof useCatalog>)
    renderBoard()

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Selecionar itens' })
    )
    await userEvent.click(screen.getByLabelText('Selecionar todos'))

    // Assert
    expect(screen.getByText('2 selecionados')).toBeInTheDocument()
    expect(screen.getByLabelText('Desmarcar todos')).toBeInTheDocument()
  })
})
