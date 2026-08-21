import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Categories } from '@pages/categories/Categories'

vi.mock('@containers/CategoriesHeaderContainer/CategoriesHeaderContainer', () => ({
  CategoriesHeaderContainer: () => <header>Cabeçalho de categorias</header>,
}))

vi.mock('@containers/CategoriesListContainer/CategoriesListContainer', () => ({
  CategoriesListContainer: () => <main>Lista de categorias</main>,
}))

describe(Categories.name, () => {
  it('composes the header and list regions of the categories screen', () => {
    render(<Categories />)

    expect(screen.getByText('Cabeçalho de categorias')).toBeInTheDocument()
    expect(screen.getByText('Lista de categorias')).toBeInTheDocument()
  })
})
