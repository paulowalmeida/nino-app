import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CATEGORIES_GHOST_ROWS } from '@pages/CatalogCategories/constants/catalog-categories.constants'
import { CategoryRowsSkeleton } from '@pages/CatalogCategories/skeletons/CategoryRowsSkeleton/CategoryRowsSkeleton'

describe(CategoryRowsSkeleton.name, () => {
  it('mirrors the table header and every loading row', () => {
    const { container } = render(<CategoryRowsSkeleton />)

    expect(container.querySelector('table')).toBeInTheDocument()
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(
      1 + 3 + CATEGORIES_GHOST_ROWS.length * 6
    )
  })
})
