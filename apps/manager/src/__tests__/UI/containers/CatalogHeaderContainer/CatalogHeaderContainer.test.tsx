import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Membership } from '@custom_types/auth/membership'
import { useCategories } from '@hooks/product/useCategories'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useTenantRole } from '@hooks/session/useTenantRole'
import { CatalogHeaderContainer } from '../../../../UI/containers/CatalogHeaderContainer/CatalogHeaderContainer'

vi.mock('@hooks/product/useCategories')
vi.mock('@hooks/session/useCurrentTenant')
vi.mock('@hooks/session/useTenantRole')

const renderContainer = (
  onTermChange = vi.fn(),
  onCategoryChange = vi.fn()
) =>
  render(
    <MemoryRouter>
      <CatalogHeaderContainer
        term=""
        categoryId={null}
        onTermChange={onTermChange}
        onCategoryChange={onCategoryChange}
      />
    </MemoryRouter>
  )

describe(CatalogHeaderContainer.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCurrentTenant).mockReturnValue({ tenantId: 'tenant-1' } as Membership)
    vi.mocked(useTenantRole).mockReturnValue('TENANT_OWNER')
    vi.mocked(useCategories).mockReturnValue({
      categories: [{ id: 'cat-1', name: 'Bebidas', position: 1 }],
      isPending: false,
    } as unknown as ReturnType<typeof useCategories>)
  })

  it('connects tenant categories and header controls to its presentation', async () => {
    const onTermChange = vi.fn()
    const onCategoryChange = vi.fn()
    const user = userEvent.setup()

    renderContainer(onTermChange, onCategoryChange)

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Buscar item pelo nome' }),
      { target: { value: 'suco' } }
    )
    await user.click(screen.getByRole('tab', { name: 'Bebidas' }))

    expect(useCategories).toHaveBeenCalledWith('tenant-1')
    expect(screen.getByRole('heading', { name: 'Cardápio' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Gerenciar categorias' })).toBeInTheDocument()
    expect(onTermChange).toHaveBeenLastCalledWith('suco')
    expect(onCategoryChange).toHaveBeenCalledWith('cat-1')
  })
})
