import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StoreCart } from './StoreCart'
import { storeCartMock } from './StoreCart.mock'

vi.mock('./CartDock/CartDock', () => ({
  CartDock: () => <p>Resumo da sacola</p>,
}))
vi.mock('./CartDrawer/CartDrawer', () => ({
  CartDrawer: () => <p>Detalhes da sacola</p>,
}))

describe('StoreCart', () => {
  it('composes the cart summary and detail regions', () => {
    render(<StoreCart />)

    expect(screen.getByText(storeCartMock.dockLabel)).toBeInTheDocument()
    expect(screen.getByText(storeCartMock.drawerLabel)).toBeInTheDocument()
  })
})
