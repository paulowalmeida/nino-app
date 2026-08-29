import { render, screen } from '@testing-library/react'
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

    expect(
      screen.getByText(
        (_, element) =>
          element?.textContent?.includes('2') === true &&
          element.textContent.includes('itens') === true &&
          element.textContent.includes('Seu pedido') === false
      )
    ).toBeInTheDocument()
    expect(screen.getByText('Seu pedido')).toBeInTheDocument()
  })
})
