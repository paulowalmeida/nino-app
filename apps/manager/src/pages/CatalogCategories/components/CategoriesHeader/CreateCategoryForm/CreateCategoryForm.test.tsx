import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CreateCategoryForm } from '@pages/CatalogCategories/components/CategoriesHeader/CreateCategoryForm/CreateCategoryForm'
import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'

vi.mock(
  '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'
)

const setCreateName = vi.fn()
const submitCreate = vi.fn().mockResolvedValue(undefined)

describe(CreateCategoryForm.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCatalogCategoriesFacade).mockReturnValue({
      createName: '',
      isCreating: false,
      setCreateName,
      submitCreate,
    } as unknown as ReturnType<typeof useCatalogCategoriesFacade>)
  })

  it('keeps submission disabled for an empty category name', () => {
    render(<CreateCategoryForm />, { wrapper: MemoryRouter })

    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeDisabled()
  })

  it('updates and submits a valid category draft', async () => {
    const user = userEvent.setup()
    vi.mocked(useCatalogCategoriesFacade).mockReturnValue({
      createName: 'Bebidas',
      isCreating: false,
      setCreateName,
      submitCreate,
    } as unknown as ReturnType<typeof useCatalogCategoriesFacade>)

    render(<CreateCategoryForm />, { wrapper: MemoryRouter })

    await user.type(
      screen.getByRole('textbox', { name: 'Nome da nova categoria' }),
      ' geladas'
    )
    await user.click(screen.getByRole('button', { name: 'Adicionar' }))

    expect(setCreateName).toHaveBeenCalled()
    expect(submitCreate).toHaveBeenCalledOnce()
  })

  it('shows creation progress through the submit control', () => {
    vi.mocked(useCatalogCategoriesFacade).mockReturnValue({
      createName: 'Bebidas',
      isCreating: true,
      setCreateName,
      submitCreate,
    } as unknown as ReturnType<typeof useCatalogCategoriesFacade>)

    render(<CreateCategoryForm />, { wrapper: MemoryRouter })

    expect(screen.getByRole('button', { name: 'Carregando' })).toBeDisabled()
  })
})
