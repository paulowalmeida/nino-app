import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router'

import {
  useAccountFacade,
} from '@pages/account/facades/useAccountFacade/useAccountFacade'

import { Orders } from './Orders'
import { ordersMock } from './Orders.mock'

vi.mock('@pages/account/facades/useAccountFacade/useAccountFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useAccountFacade).mockReturnValue({
    orders: [],
    isOrdersPending: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAccountFacade>)

const renderOrders = () =>
  render(
    <MemoryRouter initialEntries={['/loja/conta/pedidos']}>
      <Routes>
        <Route path="/:slug/conta/pedidos" element={<Orders />} />
      </Routes>
    </MemoryRouter>
  )

describe('Orders', () => {
  it('shows the empty state when there are no orders', () => {
    // Arrange
    facadeWith({ orders: [] })

    // Act
    renderOrders()

    // Assert
    expect(
      screen.getByText(
        'Seus pedidos aparecem aqui assim que você fizer o primeiro.'
      )
    ).toBeInTheDocument()
  })

  it('lists each order with its status and total', () => {
    // Arrange
    facadeWith({ orders: ordersMock.orders })

    // Act
    renderOrders()

    // Assert
    expect(screen.getByText('Pedido entregue')).toBeInTheDocument()
    expect(screen.getByText(/58,90/)).toBeInTheDocument()
  })

  it('flags a non-terminal order as in progress', () => {
    // Arrange
    facadeWith({ orders: ordersMock.pendingOrders })

    // Act
    renderOrders()

    // Assert
    expect(screen.getByText('em andamento')).toBeInTheDocument()
  })

  it('links each order to its own order page', () => {
    // Arrange
    facadeWith({ orders: ordersMock.orders })

    // Act
    renderOrders()

    // Assert
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/loja/pedido/order-1'
    )
  })
})
