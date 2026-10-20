import { MemoryRouter } from 'react-router'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CatalogHeader } from '@pages/Catalog/components/CatalogHeader/CatalogHeader'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'

vi.mock('@pages/Catalog/facades/useCatalogFacade')

const renderContainer = () =>
  render(
    <MemoryRouter>
      <CatalogHeader />
    </MemoryRouter>
  )

describe(CatalogHeader.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCatalogFacade).mockReturnValue({
      unitId: 'unit-1',
      canManageCatalog: true,
      categoryId: null,
      setSearch: vi.fn(),
      setCategoryId: vi.fn(),
      categories: [{ id: 'cat-1', name: 'Bebidas', position: 1 }],
      categoriesStatus: 'success',
      loadCategories: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof useCatalogFacade>)
  })

  it('connects unit categories and header controls to its presentation', async () => {
    const user = userEvent.setup()

    renderContainer()

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Buscar item pelo nome' }),
      { target: { value: 'suco' } }
    )
    await user.click(screen.getByRole('tab', { name: 'Bebidas' }))

    expect(
      screen.getByRole('heading', { name: 'Produtos' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Gerenciar categorias' })
    ).toBeInTheDocument()
  })

  it('debounces the typed term before triggering a search', async () => {
    const setSearch = vi.fn()
    vi.mocked(useCatalogFacade).mockReturnValue({
      unitId: 'unit-1',
      canManageCatalog: true,
      categoryId: null,
      setSearch,
      setCategoryId: vi.fn(),
      categories: [{ id: 'cat-1', name: 'Bebidas', position: 1 }],
      categoriesStatus: 'success',
      loadCategories: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof useCatalogFacade>)

    renderContainer()

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Buscar item pelo nome' }),
      { target: { value: 'suco' } }
    )

    await waitFor(() => expect(setSearch).toHaveBeenCalledWith('suco'))
  })

  it('keeps the entire header as a skeleton while the catalog is pending', () => {
    vi.mocked(useCatalogFacade).mockReturnValue({
      items: [],
      isPagePending: true,
      setSearch: vi.fn(),
    } as unknown as ReturnType<typeof useCatalogFacade>)

    renderContainer()

    expect(screen.getByRole('status')).toHaveTextContent('Carregando produtos')
    expect(
      screen.queryByRole('heading', { name: 'Produtos' })
    ).not.toBeInTheDocument()
  })
})
