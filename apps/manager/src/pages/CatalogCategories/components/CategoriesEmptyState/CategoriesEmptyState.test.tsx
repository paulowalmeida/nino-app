import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CATEGORIES_CAPABILITIES } from '@pages/CatalogCategories/constants/catalog-categories.constants'

import { CategoriesEmptyState } from './CategoriesEmptyState'
import { categoriesEmptyStateMock } from './CategoriesEmptyState.mock'

describe(CategoriesEmptyState.name, () => {
  it('names what is missing and lists what the screen does', () => {
    render(<CategoriesEmptyState />)

    expect(screen.getByText(categoriesEmptyStateMock.title)).toBeInTheDocument()
    CATEGORIES_CAPABILITIES.forEach(({ title }) =>
      expect(screen.getByText(title)).toBeInTheDocument()
    )
  })
})
