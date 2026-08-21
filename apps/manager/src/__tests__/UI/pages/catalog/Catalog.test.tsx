import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Catalog } from '@pages/catalog/Catalog'

type CatalogHeaderContainerProps = {
  term: string
  categoryId: string | null
  onTermChange: (term: string) => void
  onCategoryChange: (categoryId: string | null) => void
}

type CatalogBoardContainerProps = {
  categoryId: string | null
  search: string
}

vi.mock('../../../../UI/containers/CatalogHeaderContainer/CatalogHeaderContainer', () => ({
  CatalogHeaderContainer: ({
    term,
    categoryId,
    onTermChange,
    onCategoryChange,
  }: CatalogHeaderContainerProps) => (
    <>
      <input
        aria-label="Buscar item pelo nome"
        value={term}
        onChange={(event) => onTermChange(event.target.value)}
      />
      <button type="button" onClick={() => onCategoryChange('cat-1')}>
        Bebidas
      </button>
      <output>{categoryId ?? 'all'}</output>
    </>
  ),
}))

vi.mock('../../../../UI/containers/CatalogBoardContainer/CatalogBoardContainer', () => ({
  CatalogBoardContainer: ({
    categoryId,
    search,
  }: CatalogBoardContainerProps) => (
    <output>{`${categoryId ?? 'all'}:${search}`}</output>
  ),
}))

describe(Catalog.name, () => {
  it('coordinates the filters shared by the header and board regions', async () => {
    const user = userEvent.setup()

    render(<Catalog />)

    await user.click(screen.getByRole('button', { name: 'Bebidas' }))

    expect(screen.getByText('cat-1:')).toBeInTheDocument()
  })
})
