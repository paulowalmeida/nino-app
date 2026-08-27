import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CatalogActions } from '@pages/Catalog/components/CatalogHeader/CatalogActions/CatalogActions'

describe(CatalogActions.name, () => {
  it('exposes links for category management and creating an item', () => {
    render(
      <MemoryRouter>
        <CatalogActions />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Gerenciar categorias' })).toHaveAttribute(
      'href',
      '/categorias'
    )
    expect(screen.getByRole('link', { name: 'Novo item' })).toHaveAttribute(
      'href',
      '/novo'
    )
  })
})
