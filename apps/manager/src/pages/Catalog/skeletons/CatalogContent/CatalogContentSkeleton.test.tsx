import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MENU_BOARD_GHOST_ROWS } from '@pages/Catalog/constants/catalog.constants'
import { CatalogContentSkeleton } from '@pages/Catalog/skeletons/CatalogContent/CatalogContentSkeleton'

describe(CatalogContentSkeleton.name, () => {
  it('renders one complete placeholder row for every ghost row', () => {
    const { container } = render(<CatalogContentSkeleton />)

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(
      1 + MENU_BOARD_GHOST_ROWS.length * 6
    )
  })
})
