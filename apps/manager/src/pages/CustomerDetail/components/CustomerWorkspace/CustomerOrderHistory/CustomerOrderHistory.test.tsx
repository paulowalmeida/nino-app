import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCustomerDetailFacade } from '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'

import { CustomerOrderHistory } from './CustomerOrderHistory'
import {
  customerOrderHistoryOwnerMock,
  customerOrderRowsMock,
} from './CustomerOrderHistory.mock'

vi.mock(
  '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'
)

const facadeWith = (overrides: Record<string, unknown>) => {
  vi.mocked(useCustomerDetailFacade).mockReturnValue({
    customer: { name: customerOrderHistoryOwnerMock.name },
    orderRows: customerOrderRowsMock,
    hasNextPage: false,
    isFetchingNextPage: false,
    loadMoreOrders: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useCustomerDetailFacade>)
}

describe('CustomerOrderHistory', () => {
  it('lists the orders the customer already made', () => {
    facadeWith({})

    render(
      <MemoryRouter>
        <CustomerOrderHistory />
      </MemoryRouter>
    )

    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.getByText('entregue')).toBeInTheDocument()
  })

  it('announces that more orders are on the way', () => {
    facadeWith({ hasNextPage: true, isFetchingNextPage: true })

    render(
      <MemoryRouter>
        <CustomerOrderHistory />
      </MemoryRouter>
    )

    expect(screen.getByText('Carregando mais pedidos…')).toBeInTheDocument()
  })

  it('states the empty history window', () => {
    facadeWith({ orderRows: [] })

    render(
      <MemoryRouter>
        <CustomerOrderHistory />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Nenhum pedido nos últimos 90 dias.')
    ).toBeInTheDocument()
  })

  it('falls back to a generic back label without a loaded customer', () => {
    facadeWith({ customer: undefined })

    render(
      <MemoryRouter>
        <CustomerOrderHistory />
      </MemoryRouter>
    )

    expect(screen.getAllByRole('link')).toHaveLength(2)
  })
})
