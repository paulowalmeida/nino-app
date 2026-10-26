import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CategoriesHeader } from '@pages/CatalogCategories/components/CategoriesHeader/CategoriesHeader'
import { categoriesHeaderMock } from '@pages/CatalogCategories/components/CategoriesHeader/CategoriesHeader.mock'
import { CATEGORIES_DESCRIPTION } from '@pages/CatalogCategories/constants/catalog-categories.constants'

vi.mock(
  '@pages/CatalogCategories/components/CategoriesHeader/CreateCategoryForm/CreateCategoryForm',
  () => ({
    CreateCategoryForm: () => <div>{categoriesHeaderMock.createFormText}</div>,
  })
)

describe(CategoriesHeader.name, () => {
  it('presents category guidance and creation', () => {
    // Arrange & Act
    render(<CategoriesHeader />)

    // Assert
    expect(
      screen.getByRole('heading', { name: categoriesHeaderMock.title })
    ).toBeInTheDocument()
    expect(screen.getByText(CATEGORIES_DESCRIPTION)).toBeInTheDocument()
    expect(
      screen.getByText(categoriesHeaderMock.createFormText)
    ).toBeInTheDocument()
  })
})
