import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Membership } from '@custom_types/auth/membership'
import { useCatalogBoard } from '@hooks/product/useCatalogBoard'
import { useDeleteMenuItem } from '@hooks/product/useDeleteMenuItem'
import { useDeleteMenuItems } from '@hooks/product/useDeleteMenuItems'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { CatalogBoardContainer } from '../../../../UI/containers/CatalogBoardContainer/CatalogBoardContainer'

vi.mock('@hooks/product/useCatalogBoard')
vi.mock('@hooks/product/useDeleteMenuItem')
vi.mock('@hooks/product/useDeleteMenuItems')
vi.mock('@hooks/session/useCurrentTenant')

const item = {
  id: 'item-1',
  name: 'Suco',
  description: null,
  price: '10.00',
  position: 1,
  isActive: true,
  category: { id: 'cat-1', name: 'Bebidas', position: 1 },
  images: [],
}

describe(CatalogBoardContainer.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCurrentTenant).mockReturnValue({ tenantId: 'tenant-1' } as Membership)
    vi.mocked(useCatalogBoard).mockReturnValue({
      items: [item],
      total: 1,
      isPending: false,
      isError: false,
      isFetchingNextPage: false,
      loadMoreSentinelRef: vi.fn(),
      setAvailability: vi.fn(),
      reorderItems: vi.fn(),
    } as unknown as ReturnType<typeof useCatalogBoard>)
    vi.mocked(useDeleteMenuItem).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteMenuItem>)
    vi.mocked(useDeleteMenuItems).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteMenuItems>)
  })

  it('connects the scoped catalog query and deletion mutation to the board', async () => {
    const user = userEvent.setup()
    const deleteItem = vi.fn().mockResolvedValue(undefined)
    vi.mocked(useDeleteMenuItem).mockReturnValue({
      mutateAsync: deleteItem,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteMenuItem>)

    render(
      <MemoryRouter>
        <CatalogBoardContainer categoryId="cat-1" search="suco" />
      </MemoryRouter>
    )

    await user.click(screen.getByLabelText('Excluir Suco'))
    await user.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(useCatalogBoard).toHaveBeenCalledWith('tenant-1', 'cat-1', 'suco')
    expect(useDeleteMenuItem).toHaveBeenCalledWith('tenant-1', 'item-1')
    expect(deleteItem).toHaveBeenCalledOnce()
  })

  it('shows the query error as board content', () => {
    vi.mocked(useCatalogBoard).mockReturnValue({
      items: [],
      total: 0,
      isPending: false,
      isError: true,
      isFetchingNextPage: false,
      loadMoreSentinelRef: vi.fn(),
      setAvailability: vi.fn(),
      reorderItems: vi.fn(),
    } as unknown as ReturnType<typeof useCatalogBoard>)

    render(
      <MemoryRouter>
        <CatalogBoardContainer categoryId={null} search="" />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Não foi possível carregar o cardápio. Recarregue a página para tentar de novo.')
    ).toBeInTheDocument()
  })
})
