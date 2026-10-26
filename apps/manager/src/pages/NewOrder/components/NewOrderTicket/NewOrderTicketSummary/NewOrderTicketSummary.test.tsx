import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNewOrderFacade } from '@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade'

import { NewOrderTicketSummary } from './NewOrderTicketSummary'
import { ticketSummaryMock } from './NewOrderTicketSummary.mock'

vi.mock('@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade')

const facadeWith = (channel: string, fee: number) =>
  vi.mocked(useNewOrderFacade).mockReturnValue({
    draft: { channel, subtotal: ticketSummaryMock.subtotal },
    availability: { fee },
  } as unknown as ReturnType<typeof useNewOrderFacade>)

describe('NewOrderTicketSummary', () => {
  beforeEach(() => vi.clearAllMocks())

  it('adds the delivery fee to the total of a delivery', () => {
    facadeWith('DELIVERY', ticketSummaryMock.deliveryFee)

    render(<NewOrderTicketSummary />)

    expect(screen.getByText('Entrega')).toBeInTheDocument()
    expect(
      screen.getByText(new RegExp(ticketSummaryMock.deliveryTotalLabel))
    ).toBeInTheDocument()
  })

  it('shows no fee line at the counter', () => {
    facadeWith('COUNTER', 0)

    render(<NewOrderTicketSummary />)

    expect(screen.queryByText('Entrega')).not.toBeInTheDocument()
    expect(
      screen.getByText(new RegExp(ticketSummaryMock.counterTotalLabel))
    ).toBeInTheDocument()
  })

  it('shows no fee line for a delivery zone that costs nothing', () => {
    facadeWith('DELIVERY', 0)

    render(<NewOrderTicketSummary />)

    expect(screen.queryByText('Entrega')).not.toBeInTheDocument()
  })
})
