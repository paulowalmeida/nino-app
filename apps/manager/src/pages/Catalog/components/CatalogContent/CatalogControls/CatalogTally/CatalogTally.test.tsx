import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CatalogTally } from '@pages/Catalog/components/CatalogContent/CatalogControls/CatalogTally/CatalogTally'

describe(CatalogTally.name, () => {
  it('presents the loaded item count', () => {
    render(
      <CatalogTally
        isSelecting={false}
        selectedItemCount={0}
        total={3}
        canReorder
      />
    )

    expect(screen.getByText(/3 itens/)).toBeInTheDocument()
    expect(screen.getByText(/arraste para mudar a ordem/)).toBeInTheDocument()
  })

  it('presents the selection count without reorder guidance', () => {
    render(
      <CatalogTally isSelecting selectedItemCount={1} total={3} canReorder />
    )

    expect(screen.getByText('1 selecionado')).toBeInTheDocument()
    expect(
      screen.queryByText(/arraste para mudar a ordem/)
    ).not.toBeInTheDocument()
  })
})
