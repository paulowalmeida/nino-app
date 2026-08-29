import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import { GuestContactFields } from './GuestContactFields'
import { guestContactFieldsMock } from './GuestContactFields.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')

describe('GuestContactFields', () => {
  it('asks for the guest name and phone', () => {
    vi.mocked(useCheckoutFacade).mockReturnValue({
      register: () => ({}),
      errors: {},
    } as never)

    render(<GuestContactFields />)

    expect(screen.getByLabelText(guestContactFieldsMock.nameLabel)).toBeInTheDocument()
    expect(screen.getByLabelText(guestContactFieldsMock.phoneLabel)).toBeInTheDocument()
  })
})
