import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import { PaymentMethodFields } from './PaymentMethodFields'
import { paymentMethodFieldsMock } from './PaymentMethodFields.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')
vi.mock('react-hook-form', () => ({
  Controller: ({ render }: { render: (args: unknown) => unknown }) => render({ field: { value: 'CASH', onChange: vi.fn() } }),
}))

describe('PaymentMethodFields', () => {
  it('shows the cash change field when cash is selected', () => {
    vi.mocked(useCheckoutFacade).mockReturnValue({
      control: {},
      register: () => ({}),
      paymentMethod: 'CASH',
      paymentOptions: ['CASH'],
    } as never)

    render(<PaymentMethodFields />)

    expect(screen.getByText(paymentMethodFieldsMock.cashLabel)).toBeInTheDocument()
    expect(screen.getByLabelText(paymentMethodFieldsMock.changeLabel)).toBeInTheDocument()
  })
})
