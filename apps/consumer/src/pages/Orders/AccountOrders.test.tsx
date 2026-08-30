import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router'

import { useOrdersFacade } from '@pages/Orders/facades/useOrdersFacade/useOrdersFacade'

import { AccountOrders } from './AccountOrders'
import { accountOrdersMock } from './AccountOrders.mock'

vi.mock('@pages/Orders/facades/useOrdersFacade/useOrdersFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useOrdersFacade).mockReturnValue({
    orders: [],
    isOrdersPending: false,
    ...overrides,
  } as unknown as ReturnType<typeof useOrdersFacade>)

const renderOrders = () =>
  render(
    <MemoryRouter initialEntries={['/loja/conta/pedidos']}>
      <Routes>
        <Route path="/:slug/conta/pedidos" element={<AccountOrders />} />
      </Routes>
    </MemoryRouter>
  )

describe('AccountOrders', () => {
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
    facadeWith({ orders: accountOrdersMock.orders })

    // Act
    renderOrders()

    // Assert
    expect(screen.getByText('Pedido entregue')).toBeInTheDocument()
    expect(screen.getByText(/58,90/)).toBeInTheDocument()
  })

  it('flags a non-terminal order as in progress', () => {
    // Arrange
    facadeWith({ orders: accountOrdersMock.pendingOrders })

    // Act
    renderOrders()

    // Assert
    expect(screen.getByText('em andamento')).toBeInTheDocument()
  })

  it('links each order to its own order page', () => {
    // Arrange
    facadeWith({ orders: accountOrdersMock.orders })

    // Act
    renderOrders()

    // Assert
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/loja/pedido/order-1'
    )
  })
})
