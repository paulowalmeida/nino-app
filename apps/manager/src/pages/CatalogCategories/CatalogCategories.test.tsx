import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CatalogCategories } from '@pages/CatalogCategories/CatalogCategories'
import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'

vi.mock(
  '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'
)
vi.mock(
  '@pages/CatalogCategories/components/CategoriesHeader/CategoriesHeader',
  () => ({
    CategoriesHeader: () => <div>categories-header</div>,
  })
)
vi.mock(
  '@pages/CatalogCategories/components/CategoriesList/CategoriesList',
  () => ({
    CategoriesList: () => <div>categories-list</div>,
  })
)
vi.mock(
  '@pages/CatalogCategories/components/DeleteCategoryDialog/DeleteCategoryDialog',
  () => ({
    DeleteCategoryDialog: () => <div>delete-category-dialog</div>,
  })
)
vi.mock(
  '@pages/CatalogCategories/components/EditCategoryDialog/EditCategoryDialog',
  () => ({
    EditCategoryDialog: () => <div>edit-category-dialog</div>,
  })
)
vi.mock(
  '@pages/CatalogCategories/components/CategoriesEmptyState/CategoriesEmptyState',
  () => ({
    CategoriesEmptyState: () => <div>categories-empty-state</div>,
  })
)
vi.mock(
  '@pages/CatalogCategories/skeletons/CategoryRowsSkeleton/CategoryRowsSkeleton',
  () => ({
    CategoryRowsSkeleton: () => <div>category-rows-skeleton</div>,
  })
)

describe(CatalogCategories.name, () => {
  beforeEach(() => {
    vi.mocked(useCatalogCategoriesFacade).mockReturnValue({
      categories: [{ id: 'drinks' }],
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useCatalogCategoriesFacade>)
  })

  it('composes the category regions when data is available', () => {
    render(<CatalogCategories />)

    expect(screen.getByText('categories-header')).toBeInTheDocument()
    expect(screen.getByText('categories-list')).toBeInTheDocument()
    expect(screen.getByText('delete-category-dialog')).toBeInTheDocument()
    expect(screen.getByText('edit-category-dialog')).toBeInTheDocument()
  })

  it('governs the screen loading branch', () => {
    vi.mocked(useCatalogCategoriesFacade).mockReturnValue({
      categories: [],
      isPending: true,
      isError: false,
    } as unknown as ReturnType<typeof useCatalogCategoriesFacade>)

    render(<CatalogCategories />)

    expect(screen.getByText('category-rows-skeleton')).toBeInTheDocument()
    expect(screen.queryByText('categories-list')).not.toBeInTheDocument()
  })

  it('governs the screen error branch', () => {
    vi.mocked(useCatalogCategoriesFacade).mockReturnValue({
      categories: [],
      isPending: false,
      isError: true,
    } as unknown as ReturnType<typeof useCatalogCategoriesFacade>)

    render(<CatalogCategories />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível carregar as categorias'
    )
    expect(screen.queryByText('categories-list')).not.toBeInTheDocument()
  })

  it('governs the screen empty branch', () => {
    vi.mocked(useCatalogCategoriesFacade).mockReturnValue({
      categories: [],
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useCatalogCategoriesFacade>)

    render(<CatalogCategories />)

    expect(screen.getByText('categories-empty-state')).toBeInTheDocument()
    expect(screen.queryByText('categories-list')).not.toBeInTheDocument()
  })
})
