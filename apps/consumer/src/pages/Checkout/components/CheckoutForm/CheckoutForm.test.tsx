import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import { CheckoutForm } from './CheckoutForm'
import { checkoutFormMock } from './CheckoutForm.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')
vi.mock('@nino/forms/FormBuilder', () => ({
  FormBuilder: ({ children }: { children: () => ReactNode }) => (
    <form>{children()}</form>
  ),
}))
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
  CheckoutFooter: ({
    isLastStep,
    onContinue,
  }: {
    isLastStep: boolean
    onContinue: () => void
  }) => (
    <button type={isLastStep ? 'submit' : 'button'} onClick={onContinue}>
      {isLastStep ? 'Confirmar pedido' : 'Continuar'}
    </button>
  ),
}))

describe('CheckoutForm', () => {
  beforeEach(() => vi.stubGlobal('scrollTo', vi.fn()))

  const setupFacade = () => {
    const trigger = vi.fn().mockResolvedValue(true)
    vi.mocked(useCheckoutFacade).mockReturnValue({
      onSubmit: vi.fn(),
      form: {
        trigger,
        getValues: () => ({
          channel: 'PICKUP',
          guestName: 'Paulo',
          guestPhone: '(91) 99999-9999',
          paymentMethod: 'CASH',
        }),
      } as never,
      isDelivery: false,
      isAuthenticated: false,
      submitFailed: false,
      isBelowMinimum: false,
      minimumOrderAmount: 0,
    } as never)
    return trigger
  }

  it('starts at the receiving step', () => {
    setupFacade()

    render(<CheckoutForm {...checkoutFormMock} />)

    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('receipt')).toBeInTheDocument()
    expect(screen.getByText('channel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeInTheDocument()
  })

  it('validates and advances one step at a time', async () => {
    const trigger = setupFacade()

    render(<CheckoutForm {...checkoutFormMock} />)
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    await waitFor(() => expect(trigger).toHaveBeenCalled())
    expect(screen.getByText('contact')).toBeInTheDocument()
  })
})
