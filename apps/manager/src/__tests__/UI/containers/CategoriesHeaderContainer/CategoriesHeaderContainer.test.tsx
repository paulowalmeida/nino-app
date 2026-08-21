import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Membership } from '@custom_types/auth/membership'
import { useCreateCategoryInline } from '@hooks/product/useCreateCategoryInline'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { CategoriesHeaderContainer } from '@containers/CategoriesHeaderContainer/CategoriesHeaderContainer'

vi.mock('@hooks/product/useCreateCategoryInline')
vi.mock('@hooks/session/useCurrentTenant')

describe(CategoriesHeaderContainer.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCurrentTenant).mockReturnValue({ tenantId: 'tenant-1' } as Membership)
  })

  it('connects tenant-scoped category creation to the header form', async () => {
    const setName = vi.fn()
    const submit = vi.fn().mockResolvedValue(undefined)
    vi.mocked(useCreateCategoryInline).mockReturnValue({
      name: 'Sobremesas',
      setName,
      submit,
      isPending: false,
    })
    render(
      <MemoryRouter>
        <CategoriesHeaderContainer />
      </MemoryRouter>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Adicionar' }))

    expect(useCreateCategoryInline).toHaveBeenCalledWith('tenant-1')
    expect(screen.getByRole('heading', { name: 'Como o cardápio se organiza' })).toBeInTheDocument()
    expect(submit).toHaveBeenCalledOnce()
  })
})
