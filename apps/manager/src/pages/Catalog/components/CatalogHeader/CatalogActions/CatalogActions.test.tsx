import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CatalogActions } from '@pages/Catalog/components/CatalogHeader/CatalogActions/CatalogActions'

describe(CatalogActions.name, () => {
  it('exposes links for category management and creating an item', () => {
    render(
      <MemoryRouter initialEntries={['/loja-teste/produtos']}>
        <Routes>
          <Route path=":unitId">
            <Route path="produtos" element={<CatalogActions />} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: 'Gerenciar categorias' })
    ).toHaveAttribute('href', '/loja-teste/categorias-produtos')
    expect(screen.getByRole('link', { name: 'Novo item' })).toHaveAttribute(
      'href',
      '/loja-teste/produtos/novo'
    )
  })
})
