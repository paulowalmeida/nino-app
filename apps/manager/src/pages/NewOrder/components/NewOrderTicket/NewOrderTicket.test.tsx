import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNewOrderFacade } from '@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade'

import { NewOrderTicket } from './NewOrderTicket'
import { newOrderTicketMock } from './NewOrderTicket.mock'

vi.mock('@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade')
vi.mock(
  '@pages/NewOrder/components/NewOrderTicket/NewOrderTicketLines/NewOrderTicketLines',
  () => ({ NewOrderTicketLines: () => <div>lines</div> })
)
vi.mock(
  '@pages/NewOrder/components/NewOrderTicket/NewOrderTicketSummary/NewOrderTicketSummary',
  () => ({ NewOrderTicketSummary: () => <div>summary</div> })
)
vi.mock(
  '@pages/NewOrder/components/NewOrderTicket/NewOrderTicketFields/NewOrderTicketFields',
  () => ({ NewOrderTicketFields: () => <div>fields</div> })
)
vi.mock(
  '@pages/NewOrder/components/NewOrderTicket/NewOrderTicketActions/NewOrderTicketActions',
  () => ({ NewOrderTicketActions: () => <div>actions</div> })
)

const facadeWithLines = (lines: unknown[]) =>
  vi.mocked(useNewOrderFacade).mockReturnValue({
    draft: { lines },
  } as unknown as ReturnType<typeof useNewOrderFacade>)

describe('NewOrderTicket', () => {
  beforeEach(() => vi.clearAllMocks())

  it('composes lines, total, fields, and the closing action', () => {
    facadeWithLines([{ productId: 'product-1' }])

    render(<NewOrderTicket />)

    expect(
      screen.getByRole('heading', { name: newOrderTicketMock.title })
    ).toBeInTheDocument()
    expect(screen.getByText('lines')).toBeInTheDocument()
    expect(screen.getByText('summary')).toBeInTheDocument()
    expect(screen.getByText('fields')).toBeInTheDocument()
    expect(screen.getByText('actions')).toBeInTheDocument()
    expect(
      screen.queryByText(newOrderTicketMock.emptyMessage)
    ).not.toBeInTheDocument()
  })

  it('tells the attendant how to start an empty ticket', () => {
    facadeWithLines([])

    render(<NewOrderTicket />)

    expect(
      screen.getByText(newOrderTicketMock.emptyMessage)
    ).toBeInTheDocument()
  })
})
