import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TopSalesTable } from './TopSalesTable'
import { topSalesTableMock } from './TopSalesTable.mock'

describe('TopSalesTable', () => {
  it('ranks the products with quantity, unit price and revenue', () => {
    render(<TopSalesTable products={topSalesTableMock.products} />)

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(topSalesTableMock.products.length + 1)
    expect(screen.getByText('Pastel de queijo')).toBeInTheDocument()
    expect(screen.getByText('10 un')).toBeInTheDocument()
    expect(screen.getByText('R$ 180,00')).toBeInTheDocument()
  })

  it('exposes the ranking as a deep-link target', () => {
    render(<TopSalesTable products={topSalesTableMock.products} />)

    expect(
      screen.getByRole('region', { name: 'Produtos mais vendidos' })
    ).toHaveAttribute('id', 'mais-vendidos')
  })
})
