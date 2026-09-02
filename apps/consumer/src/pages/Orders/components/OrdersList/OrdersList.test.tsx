import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { OrdersList } from './OrdersList'
import { ordersListMock } from './OrdersList.mock'

describe('OrdersList', () => {
  it('renders order status, total, and store-scoped link', () => {
    render(
      <MemoryRouter>
        <OrdersList {...ordersListMock} />
      </MemoryRouter>
    )

    expect(screen.getByText('Pedido entregue')).toBeInTheDocument()
    expect(screen.getByText(/58,90/)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/loja/pedido/order-1'
    )
  })

  it('marks active orders as in progress', () => {
    render(
      <MemoryRouter>
        <OrdersList {...ordersListMock} orders={ordersListMock.pendingOrders} />
      </MemoryRouter>
    )

    expect(screen.getByText('em andamento')).toBeInTheDocument()
  })
})
