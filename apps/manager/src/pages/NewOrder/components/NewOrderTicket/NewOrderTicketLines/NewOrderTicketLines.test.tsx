import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNewOrderFacade } from '@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade'

import { NewOrderTicketLines } from './NewOrderTicketLines'
import { ticketLinesMock } from './NewOrderTicketLines.mock'

vi.mock('@pages/NewOrder/facades/useNewOrderFacade/useNewOrderFacade')

const step = vi.fn()

const facadeWithLines = (lines: unknown[]) =>
  vi.mocked(useNewOrderFacade).mockReturnValue({
    draft: { lines, step },
  } as unknown as ReturnType<typeof useNewOrderFacade>)

describe('NewOrderTicketLines', () => {
  beforeEach(() => vi.clearAllMocks())

  it('prices each line by its quantity', () => {
    facadeWithLines(ticketLinesMock)

    render(<NewOrderTicketLines />)

    expect(screen.getByText('Coxinha')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText(/15,00/)).toBeInTheDocument()
  })

  it('adds and removes one unit from the line', async () => {
    facadeWithLines(ticketLinesMock)

    render(<NewOrderTicketLines />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Mais um Coxinha' })
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Tirar um Coxinha' })
    )

    expect(step).toHaveBeenNthCalledWith(1, 'product-1', 1)
    expect(step).toHaveBeenNthCalledWith(2, 'product-1', -1)
  })

  it('renders nothing while the ticket is empty', () => {
    facadeWithLines([])

    const { container } = render(<NewOrderTicketLines />)

    expect(container).toBeEmptyDOMElement()
  })
})
