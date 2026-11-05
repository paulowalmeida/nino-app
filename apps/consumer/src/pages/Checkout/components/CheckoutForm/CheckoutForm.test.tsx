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

  const setupFacade = (trigger = vi.fn().mockResolvedValue(true)) => {
    const clearErrors = vi.fn()
    vi.mocked(useCheckoutFacade).mockReturnValue({
      onSubmit: vi.fn(),
      form: {
        trigger,
        clearErrors,
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
    return { trigger, clearErrors }
  }

  it('starts with contact so returning customers can recover their data', () => {
    setupFacade()

    render(<CheckoutForm {...checkoutFormMock} />)

    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('receipt')).toBeInTheDocument()
    expect(screen.getByText('contact')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Continuar' })
    ).toBeInTheDocument()
  })

  it('validates and advances one step at a time', async () => {
    const { trigger, clearErrors } = setupFacade()

    render(<CheckoutForm {...checkoutFormMock} />)
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    await waitFor(() => expect(trigger).toHaveBeenCalled())
    expect(clearErrors).toHaveBeenCalledWith([
      'guestName',
      'guestPhone',
    ])
    expect(screen.getByText('channel')).toBeInTheDocument()
  })

  it('keeps contact errors on invalid submit, then clears them after correction', async () => {
    const trigger = vi
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)
    const { clearErrors } = setupFacade(trigger)

    render(<CheckoutForm {...checkoutFormMock} />)

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    await waitFor(() => expect(trigger).toHaveBeenCalledTimes(1))
    expect(clearErrors).not.toHaveBeenCalled()
    expect(screen.getByText('contact')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    await waitFor(() => expect(screen.getByText('channel')).toBeInTheDocument())
    expect(clearErrors).toHaveBeenCalledWith(['guestName', 'guestPhone'])
  })
})
