import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useConsumerDetailFacade } from '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'

import { ConsumerOrderHistory } from './ConsumerOrderHistory'
import {
  consumerOrderHistoryOwnerMock,
  consumerOrderRowsMock,
} from './ConsumerOrderHistory.mock'

vi.mock(
  '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'
)

const facadeWith = (overrides: Record<string, unknown>) => {
  vi.mocked(useConsumerDetailFacade).mockReturnValue({
    consumer: { name: consumerOrderHistoryOwnerMock.name },
    orderRows: consumerOrderRowsMock,
    hasNextPage: false,
    isFetchingNextPage: false,
    loadMoreOrders: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useConsumerDetailFacade>)
}

describe('ConsumerOrderHistory', () => {
  it('lists the orders the consumer already made', () => {
    facadeWith({})

    render(
      <MemoryRouter>
        <ConsumerOrderHistory />
      </MemoryRouter>
    )

    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.getByText('entregue')).toBeInTheDocument()
  })

  it('announces that more orders are on the way', () => {
    facadeWith({ hasNextPage: true, isFetchingNextPage: true })

    render(
      <MemoryRouter>
        <ConsumerOrderHistory />
      </MemoryRouter>
    )

    expect(screen.getByText('Carregando mais pedidos…')).toBeInTheDocument()
  })

  it('states the empty history window', () => {
    facadeWith({ orderRows: [] })

    render(
      <MemoryRouter>
        <ConsumerOrderHistory />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Nenhum pedido nos últimos 90 dias.')
    ).toBeInTheDocument()
  })

  it('falls back to a generic back label without a loaded consumer', () => {
    facadeWith({ consumer: undefined })

    render(
      <MemoryRouter>
        <ConsumerOrderHistory />
      </MemoryRouter>
    )

    expect(screen.getAllByRole('link')).toHaveLength(2)
  })
})
