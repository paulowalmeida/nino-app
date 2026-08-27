import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrderDetailFacade } from '@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade'

import { OrderCustomerBlock } from './OrderCustomerBlock'
import { counterOrderMock, deliveryOrderMock } from './OrderCustomerBlock.mock'

vi.mock('@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade')

const facadeWithOrder = (order: unknown) =>
  vi.mocked(useOrderDetailFacade).mockReturnValue({
    order,
  } as unknown as ReturnType<typeof useOrderDetailFacade>)

describe('OrderCustomerBlock', () => {
  beforeEach(() => vi.clearAllMocks())

  it('names who ordered and offers the call', () => {
    facadeWithOrder(deliveryOrderMock)

    render(<OrderCustomerBlock />)

    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', 'tel:11988887777')
    expect(screen.getByText(/Rua Olimpíadas/)).toBeInTheDocument()
  })

  it('shows the table of an order taken at the counter', () => {
    facadeWithOrder(counterOrderMock)

    render(<OrderCustomerBlock />)

    expect(screen.getByText('Mesa 4')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders nothing while the order is unknown', () => {
    facadeWithOrder(undefined)

    const { container } = render(<OrderCustomerBlock />)

    expect(container).toBeEmptyDOMElement()
  })
})
