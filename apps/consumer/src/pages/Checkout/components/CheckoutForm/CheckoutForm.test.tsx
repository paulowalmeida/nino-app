import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import { CheckoutForm } from './CheckoutForm'
import { checkoutFormMock } from './CheckoutForm.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')
vi.mock('./CheckoutHeader/CheckoutHeader', () => ({
  CheckoutHeader: () => <div>header</div>,
}))
vi.mock('./CheckoutReceipt/CheckoutReceipt', () => ({
  CheckoutReceipt: () => <div>receipt</div>,
}))
vi.mock('./ChannelFields/ChannelFields', () => ({
  ChannelFields: () => <div>channel</div>,
}))
vi.mock('./GuestContactFields/GuestContactFields', () => ({
  GuestContactFields: () => <div>contact</div>,
}))
vi.mock('./PaymentMethodFields/PaymentMethodFields', () => ({
  PaymentMethodFields: () => <div>payment</div>,
}))
vi.mock('./OrderNotesField/OrderNotesField', () => ({
  OrderNotesField: () => <div>notes</div>,
}))
vi.mock('./CheckoutFooter/CheckoutFooter', () => ({
  CheckoutFooter: () => <button type="submit">Confirmar pedido</button>,
}))

describe('CheckoutForm', () => {
  it('composes the checkout regions through the facade contract', () => {
    vi.mocked(useCheckoutFacade).mockReturnValue({
      submit: vi.fn(),
      isDelivery: false,
      submitFailed: false,
    } as never)

    render(<CheckoutForm {...checkoutFormMock} />)

    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('receipt')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Confirmar pedido' })
    ).toBeInTheDocument()
  })
})
