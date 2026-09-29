import { render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { useForm } from 'react-hook-form'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { CheckoutFormValues } from '@pages/checkout/types/checkout/CheckoutFormValues.type'

import { GuestContactFields } from './GuestContactFields'
import { guestContactFieldsMock } from './GuestContactFields.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')

describe('GuestContactFields', () => {
  it('asks for the guest name and phone', () => {
    const { result } = renderHook(() =>
      useForm<CheckoutFormValues>({
        defaultValues: { guestPhone: '(91) 99999-9999' },
      })
    )
    vi.mocked(useCheckoutFacade).mockReturnValue({
      register: () => ({}),
      errors: {},
      control: result.current.control,
    } as never)

    render(
      <MemoryRouter initialEntries={['/demo/checkout']}>
        <GuestContactFields />
      </MemoryRouter>
    )

    expect(
      screen.getByLabelText(guestContactFieldsMock.nameLabel)
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(guestContactFieldsMock.phoneLabel)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /recuperar dados/i })
    ).toHaveAttribute('href', '/entrar?returnTo=%2Fcheckout')
  })
})
