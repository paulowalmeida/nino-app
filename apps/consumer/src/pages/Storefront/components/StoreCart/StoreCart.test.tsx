import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StoreCart } from './StoreCart'
import { storeCartMock } from './StoreCart.mock'

vi.mock('./CartDrawer/CartDrawer', () => ({
  CartDrawer: () => <p>Detalhes da sacola</p>,
}))

describe('StoreCart', () => {
  it('renders the cart detail region', () => {
    render(<StoreCart />)

    expect(screen.getByText(storeCartMock.drawerLabel)).toBeInTheDocument()
  })
})
