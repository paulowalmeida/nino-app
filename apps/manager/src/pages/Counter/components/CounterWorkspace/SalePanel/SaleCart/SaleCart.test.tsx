import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SaleCart } from './SaleCart'
import { saleCartMock } from './SaleCart.mock'

vi.mock('@shared/components/ItemThumb/ItemThumb', () => ({
  ItemThumb: () => <span>thumb</span>,
}))

const line = { productId: 'item-1', name: 'Café', unitPrice: '10', quantity: 1 }

describe(SaleCart.name, () => {
  it('renders the empty cart', () => {
    render(<SaleCart {...saleCartMock} onStep={vi.fn()} />)
    expect(screen.getByText(/Toque nos itens/)).toBeInTheDocument()
  })

  it('renders a line and steps its quantity', () => {
    const onStep = vi.fn()
    render(<SaleCart lines={[line]} onStep={onStep} />)
    expect(screen.getByText('Café')).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: 'Tirar Café da comanda' })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Mais um Café' }))
    expect(onStep).toHaveBeenNthCalledWith(1, 'item-1', -1)
    expect(onStep).toHaveBeenNthCalledWith(2, 'item-1', 1)
  })

  it('uses minus copy for a line with multiple units', () => {
    render(<SaleCart lines={[{ ...line, quantity: 2 }]} onStep={vi.fn()} />)
    expect(
      screen.getByRole('button', { name: 'Tirar um Café' })
    ).toBeInTheDocument()
  })
})
