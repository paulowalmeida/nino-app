import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CATEGORIES_GHOST_ROWS } from '@pages/CatalogCategories/constants/catalog-categories.constants'
import { CategoryRowsSkeleton } from '@pages/CatalogCategories/skeletons/CategoryRowsSkeleton/CategoryRowsSkeleton'

describe(CategoryRowsSkeleton.name, () => {
  it('mirrors every loading row with handle, text, and action placeholders', () => {
    const { container } = render(<CategoryRowsSkeleton />)

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(
      CATEGORIES_GHOST_ROWS.length * 5
    )
  })
})
