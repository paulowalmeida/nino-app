import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Membership } from '@custom_types/auth/membership'
import { useCategories } from '@hooks/product/useCategories'
import { useCategoryOrder } from '@hooks/product/useCategoryOrder'
import { useDeleteCategory } from '@hooks/product/useDeleteCategory'
import { useMenu } from '@hooks/product/useMenu'
import { useUpdateCategory } from '@hooks/product/useUpdateCategory'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { CategoriesListContainer } from '@containers/CategoriesListContainer/CategoriesListContainer'

vi.mock('@hooks/product/useCategories')
vi.mock('@hooks/product/useCategoryOrder')
vi.mock('@hooks/product/useDeleteCategory')
vi.mock('@hooks/product/useMenu')
vi.mock('@hooks/product/useUpdateCategory')
vi.mock('@hooks/session/useCurrentTenant')

const category = {
  id: 'cat-1',
  name: 'Sobremesas',
  position: 0,
  count: 0,
}

describe(CategoriesListContainer.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCurrentTenant).mockReturnValue({ tenantId: 'tenant-1' } as Membership)
    vi.mocked(useCategories).mockReturnValue({
      categories: [],
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useCategories>)
    vi.mocked(useMenu).mockReturnValue({
      sections: [],
    } as unknown as ReturnType<typeof useMenu>)
    vi.mocked(useCategoryOrder).mockReturnValue({
      order: [category],
      setOrder: vi.fn(),
      persistOrder: vi.fn(),
    } as unknown as ReturnType<typeof useCategoryOrder>)
    vi.mocked(useUpdateCategory).mockReturnValue({
      mutateAsync: vi.fn(),
      variables: undefined,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateCategory>)
    vi.mocked(useDeleteCategory).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteCategory>)
  })

  it('connects the selected category to the scoped deletion mutation', async () => {
    const remove = vi.fn().mockResolvedValue(undefined)
    vi.mocked(useDeleteCategory).mockReturnValue({
      mutateAsync: remove,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteCategory>)
    render(
      <MemoryRouter>
        <CategoriesListContainer />
      </MemoryRouter>
    )

    await userEvent.click(screen.getByLabelText('Excluir Sobremesas'))
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(useCategories).toHaveBeenCalledWith('tenant-1')
    expect(useDeleteCategory).toHaveBeenCalledWith('tenant-1')
    expect(remove).toHaveBeenCalledWith('cat-1')
  })

  it('shows the mutation failure as dialog feedback', async () => {
    vi.mocked(useDeleteCategory).mockReturnValue({
      mutateAsync: vi.fn().mockRejectedValue(new Error('network error')),
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteCategory>)
    render(
      <MemoryRouter>
        <CategoriesListContainer />
      </MemoryRouter>
    )

    await userEvent.click(screen.getByLabelText('Excluir Sobremesas'))
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    await waitFor(() =>
      expect(
        screen.getByText('Não foi possível excluir. Tente de novo.')
      ).toBeInTheDocument()
    )
  })
})
