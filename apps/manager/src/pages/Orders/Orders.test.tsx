import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Orders } from './Orders'
import { ordersPageMock } from './Orders.mock'

vi.mock('@pages/Orders/components/OrdersHeader/OrdersHeader', () => ({
  OrdersHeader: () => <h1>{ordersPageMock.title}</h1>,
}))
vi.mock('@pages/Orders/components/OrdersFilters/OrdersFilters', () => ({
  OrdersFilters: () => <div>filters</div>,
}))
vi.mock('@pages/Orders/components/OrdersQueue/OrdersQueue', () => ({
  OrdersQueue: () => <div>queue</div>,
}))

describe('Orders', () => {
  it('composes the orders screen regions', () => {
    render(<Orders />)

    expect(screen.getByRole('heading', { name: ordersPageMock.title })).toBeInTheDocument()
    expect(screen.getByText('filters')).toBeInTheDocument()
    expect(screen.getByText('queue')).toBeInTheDocument()
  })
})
