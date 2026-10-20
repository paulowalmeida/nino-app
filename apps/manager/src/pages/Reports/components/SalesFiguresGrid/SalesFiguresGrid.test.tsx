import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SalesFiguresGrid } from './SalesFiguresGrid'
import { salesFiguresGridMock } from './SalesFiguresGrid.mock'

describe('SalesFiguresGrid', () => {
  it('shows revenue and average ticket as money and the order count as a number', () => {
    render(<SalesFiguresGrid report={salesFiguresGridMock.report} />)

    expect(screen.getByText('R$ 125,50')).toBeInTheDocument()
    expect(screen.getByText('R$ 17,93')).toBeInTheDocument()
    expect(screen.getByText('Faturamento')).toBeInTheDocument()
    expect(screen.getByText('Pedidos concluídos')).toBeInTheDocument()
    expect(screen.getByText('Ticket médio')).toBeInTheDocument()
  })
})
