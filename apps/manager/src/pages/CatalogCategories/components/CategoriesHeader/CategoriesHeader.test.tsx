import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CategoriesHeader } from '@pages/CatalogCategories/components/CategoriesHeader/CategoriesHeader'
import { CATEGORIES_DESCRIPTION } from '@pages/CatalogCategories/constants/catalog-categories.constants'

vi.mock('@pages/CatalogCategories/components/CategoriesHeader/CreateCategoryForm/CreateCategoryForm', () => ({
  CreateCategoryForm: () => <div>create-category-form</div>,
}))

describe(CategoriesHeader.name, () => {
  it('presents navigation, category guidance, and creation', () => {
    render(
      <MemoryRouter>
        <CategoriesHeader />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Cardápio' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Como o cardápio se organiza' })
    ).toBeInTheDocument()
    expect(screen.getByText(CATEGORIES_DESCRIPTION)).toBeInTheDocument()
    expect(screen.getByText('create-category-form')).toBeInTheDocument()
  })
})
