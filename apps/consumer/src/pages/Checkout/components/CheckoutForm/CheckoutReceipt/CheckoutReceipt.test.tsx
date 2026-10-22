import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import { CheckoutReceipt } from './CheckoutReceipt'
import { checkoutReceiptMock } from './CheckoutReceipt.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')

describe('CheckoutReceipt', () => {
  it('summarizes the number of items and subtotal', () => {
    vi.mocked(useCheckoutFacade).mockReturnValue({
      cartLines: [
        {
          item: {
            id: 'item-1',
            name: checkoutReceiptMock.itemName,
            price: '18',
          },
          quantity: checkoutReceiptMock.itemQuantity,
        },
      ],
      subtotal: checkoutReceiptMock.subtotal,
      isDelivery: false,
      zone: undefined,
      deliveryFee: 0,
    } as never)

    render(<CheckoutReceipt />)

    expect(screen.getByRole('button')).toHaveTextContent('2 itens')
    expect(screen.getByText('Resumo do pedido')).toBeInTheDocument()
  })

  it('strikes the delivery fee and shows Grátis when free delivery applies', async () => {
    vi.mocked(useCheckoutFacade).mockReturnValue({
      cartLines: [],
      subtotal: checkoutReceiptMock.subtotal,
      isDelivery: true,
      zone: checkoutReceiptMock.zone,
      deliveryFee: checkoutReceiptMock.deliveryFee,
      deliveryDiscount: checkoutReceiptMock.deliveryFee,
      freeDeliveryCoverage: 'applied',
    } as never)

    render(<CheckoutReceipt />)
    await userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Grátis')).toBeInTheDocument()
    expect(screen.getByText(/R\$\s7,00/)).toHaveClass(/freeDeliveryWas/)
  })

  it('tells the customer free delivery does not cover this address', async () => {
    vi.mocked(useCheckoutFacade).mockReturnValue({
      cartLines: [],
      subtotal: checkoutReceiptMock.subtotal,
      isDelivery: true,
      zone: checkoutReceiptMock.zone,
      deliveryFee: checkoutReceiptMock.deliveryFee,
      deliveryDiscount: 0,
      freeDeliveryCoverage: 'outside-zone',
    } as never)

    render(<CheckoutReceipt />)
    await userEvent.click(screen.getByRole('button'))

    expect(
      screen.getByText('Frete grátis não vale para este endereço.')
    ).toBeInTheDocument()
    expect(screen.queryByText('Grátis')).not.toBeInTheDocument()
  })

  it('shows the coupon discount as its own line', async () => {
    vi.mocked(useCheckoutFacade).mockReturnValue({
      cartLines: [],
      subtotal: checkoutReceiptMock.subtotal,
      isDelivery: false,
      zone: undefined,
      deliveryFee: 0,
      deliveryDiscount: 0,
      freeDeliveryCoverage: 'none',
      promotionDiscount: 3.6,
      appliedDiscount: { code: 'VOLTA10' },
    } as never)

    render(<CheckoutReceipt />)
    await userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Cupom VOLTA10')).toBeInTheDocument()
    expect(screen.getByText(/−\sR\$\s3,60/)).toBeInTheDocument()
  })
})
