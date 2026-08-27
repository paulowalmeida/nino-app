import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNewOrderFacade } from '@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade'

import { NewOrderTicketActions } from './NewOrderTicketActions'
import { ticketActionsMock } from './NewOrderTicketActions.mock'

vi.mock('@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade')

const placeOrder = vi.fn()

const facadeWith = (
  draft: Record<string, unknown>,
  availability: Record<string, unknown>,
  rest: Record<string, unknown> = {}
) =>
  vi.mocked(useNewOrderFacade).mockReturnValue({
    draft: { lines: [{ productId: 'product-1' }], ...draft },
    availability: {
      missingRecipient: false,
      closedNow: false,
      ...availability,
    },
    failed: false,
    isSubmitting: false,
    placeOrder,
    ...rest,
  } as unknown as ReturnType<typeof useNewOrderFacade>)

describe('NewOrderTicketActions', () => {
  beforeEach(() => vi.clearAllMocks())

  it('opens the order from the closing button', async () => {
    facadeWith({ channel: 'COUNTER' }, {})

    render(<NewOrderTicketActions />)
    await userEvent.click(
      screen.getByRole('button', { name: ticketActionsMock.placeLabel })
    )

    expect(placeOrder).toHaveBeenCalledOnce()
  })

  it('blocks the button with an empty ticket', () => {
    facadeWith({ channel: 'COUNTER', lines: [] }, {})

    render(<NewOrderTicketActions />)

    expect(
      screen.getByRole('button', { name: ticketActionsMock.placeLabel })
    ).toBeDisabled()
  })

  it('demands the address before delivering', () => {
    facadeWith({ channel: 'DELIVERY' }, { missingRecipient: true })

    render(<NewOrderTicketActions />)

    expect(
      screen.getByText(ticketActionsMock.missingRecipientHint)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: ticketActionsMock.placeLabel })
    ).toBeDisabled()
  })

  it('warns that a paused store still takes the order', () => {
    facadeWith({ channel: 'DELIVERY' }, { closedNow: true, isPaused: true })

    render(<NewOrderTicketActions />)

    expect(
      screen.getByText(ticketActionsMock.pausedWarning)
    ).toBeInTheDocument()
  })

  it('warns that the order arrives outside delivery hours', () => {
    facadeWith({ channel: 'DELIVERY' }, { closedNow: true, isPaused: false })

    render(<NewOrderTicketActions />)

    expect(
      screen.getByText(ticketActionsMock.closedWarning)
    ).toBeInTheDocument()
  })

  it('reports a failed order and keeps the ticket', () => {
    facadeWith({ channel: 'COUNTER' }, {}, { failed: true })

    render(<NewOrderTicketActions />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      ticketActionsMock.failureMessage
    )
  })
})
