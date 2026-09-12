import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrderDetailFacade } from '@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade'

import { OrderConsumerBlock } from './OrderConsumerBlock'
import { counterOrderMock, deliveryOrderMock } from './OrderConsumerBlock.mock'

vi.mock('@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade')

const facadeWithOrder = (order: unknown) =>
  vi.mocked(useOrderDetailFacade).mockReturnValue({
    order,
  } as unknown as ReturnType<typeof useOrderDetailFacade>)

describe('OrderConsumerBlock', () => {
  beforeEach(() => vi.clearAllMocks())

  it('names who ordered and offers the call', () => {
    facadeWithOrder(deliveryOrderMock)

    render(<OrderConsumerBlock />)

    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', 'tel:11988887777')
    expect(screen.getByText(/Rua Olimpíadas/)).toBeInTheDocument()
  })

  it('shows the table of an order taken at the counter', () => {
    facadeWithOrder(counterOrderMock)

    render(<OrderConsumerBlock />)

    expect(screen.getByText('Mesa 4')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders nothing while the order is unknown', () => {
    facadeWithOrder(undefined)

    const { container } = render(<OrderConsumerBlock />)

    expect(container).toBeEmptyDOMElement()
  })
})
