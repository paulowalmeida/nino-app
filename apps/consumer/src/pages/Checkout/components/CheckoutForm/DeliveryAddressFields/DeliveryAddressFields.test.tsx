import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import { DeliveryAddressFields } from './DeliveryAddressFields'
import { deliveryAddressFieldsMock } from './DeliveryAddressFields.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')
vi.mock('react-hook-form', () => ({
  Controller: ({ render }: { render: (args: unknown) => unknown }) =>
    render({ field: { value: '', onChange: vi.fn() } }),
}))

describe('DeliveryAddressFields', () => {
  it('shows the quoted delivery zone', () => {
    vi.mocked(useCheckoutFacade).mockReturnValue({
      control: {},
      register: () => ({}),
      errors: {},
      zone: {
        name: deliveryAddressFieldsMock.zoneName,
        fee: deliveryAddressFieldsMock.zoneFee,
      },
      isQuoting: false,
    } as never)

    render(<DeliveryAddressFields />)

    expect(screen.getByText(/Centro/)).toBeInTheDocument()
    expect(screen.getByLabelText('Rua')).toBeInTheDocument()
  })
})
