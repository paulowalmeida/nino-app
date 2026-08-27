import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MenuRowContent } from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowContent/MenuRowContent'
import { item } from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowContent/MenuRowContent.mock'

describe(MenuRowContent.name, () => {
  it('presents the item information and links to its detail', () => {
    render(
      <MemoryRouter>
        <MenuRowContent item={item} />
      </MemoryRouter>
    )

    expect(screen.getByRole('link')).toHaveAttribute('href', `/${item.id}`)
    expect(screen.getByText(item.name)).toBeInTheDocument()
    expect(screen.getByText(item.description!)).toBeInTheDocument()
    expect(screen.getByText('R$ 8,50')).toBeInTheDocument()
  })

  it('hides the description and marks inactive item details', () => {
    render(
      <MemoryRouter>
        <MenuRowContent
          item={{ ...item, description: null, isActive: false }}
        />
      </MemoryRouter>
    )

    expect(screen.queryByText(item.description!)).not.toBeInTheDocument()
    expect(screen.getByText(item.name)).toBeInTheDocument()
    expect(screen.getByText('R$ 8,50')).toBeInTheDocument()
  })
})
