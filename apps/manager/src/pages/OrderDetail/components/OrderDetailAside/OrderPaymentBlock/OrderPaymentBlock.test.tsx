import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrderDetailFacade } from '@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade'

import { OrderPaymentBlock } from './OrderPaymentBlock'
import {
  cashOnDeliveryOrderMock,
  paidOrderMock,
} from './OrderPaymentBlock.mock'

vi.mock('@pages/OrderDetail/facades/useOrderDetailFacade/useOrderDetailFacade')

const markOrderPaid = vi.fn()

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useOrderDetailFacade).mockReturnValue({
    order: cashOnDeliveryOrderMock,
    canMarkPaid: true,
    markOrderPaid,
    isPaying: false,
    ...overrides,
  } as unknown as ReturnType<typeof useOrderDetailFacade>)

describe('OrderPaymentBlock', () => {
  beforeEach(() => vi.clearAllMocks())

  it('states how the order is paid and the change to carry', () => {
    facadeWith({})

    render(<OrderPaymentBlock />)

    expect(screen.getByText(/Dinheiro|dinheiro/)).toBeInTheDocument()
    expect(screen.getByText(/Levar troco para/)).toHaveTextContent('50,00')
  })

  it('registers the payment the attendant received', async () => {
    facadeWith({})

    render(<OrderPaymentBlock />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Recebi o pagamento' })
    )

    expect(markOrderPaid).toHaveBeenCalledWith(cashOnDeliveryOrderMock.id)
  })

  it('offers no charge when the policy closed it', () => {
    facadeWith({ order: paidOrderMock, canMarkPaid: false })

    render(<OrderPaymentBlock />)

    expect(
      screen.queryByRole('button', { name: 'Recebi o pagamento' })
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/Levar troco/)).not.toBeInTheDocument()
  })

  it('renders nothing while the order is unknown', () => {
    facadeWith({ order: undefined })

    const { container } = render(<OrderPaymentBlock />)

    expect(container).toBeEmptyDOMElement()
  })
})
