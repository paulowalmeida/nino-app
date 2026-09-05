import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { useGuestAddressLookup } from '@pages/checkout/hooks/useGuestAddressLookup/useGuestAddressLookup'
import { useGuestAddressSearch } from '@pages/checkout/hooks/useGuestAddressSearch/useGuestAddressSearch'

import { DeliveryAddressFields } from './DeliveryAddressFields'
import { deliveryAddressFieldsMock } from './DeliveryAddressFields.mock'

vi.mock('@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade')
vi.mock('@pages/checkout/hooks/useGuestAddressLookup/useGuestAddressLookup')
vi.mock('@pages/checkout/hooks/useGuestAddressSearch/useGuestAddressSearch')
vi.mock('react-hook-form', () => ({
  Controller: ({ render }: { render: (args: unknown) => unknown }) =>
    render({ field: { value: '', onChange: vi.fn() } }),
  useWatch: () => '',
}))

describe('DeliveryAddressFields', () => {
  const setup = ({ isPending = false, mutate = vi.fn() } = {}) => {
    const setValue = vi.fn()
    const setFocus = vi.fn()
    vi.mocked(useGuestAddressLookup).mockReturnValue({
      mutate,
      isPending,
    } as never)
    vi.mocked(useGuestAddressSearch).mockReturnValue({
      suggestions: [],
      isSearching: false,
    })
    vi.mocked(useCheckoutFacade).mockReturnValue({
      control: {},
      form: {
        getValues: () => ({}),
        setValue,
        setFocus,
      },
      register: (name: string) => ({ name, onChange: vi.fn() }),
      errors: {},
      zone: {
        name: deliveryAddressFieldsMock.zoneName,
        fee: deliveryAddressFieldsMock.zoneFee,
      },
      isQuoting: false,
      isAuthenticated: false,
      addresses: [],
    } as never)

    return { setValue, setFocus }
  }

  it('shows the quoted delivery zone', () => {
    setup()

    render(<DeliveryAddressFields />)

    expect(screen.getByText(/Centro/)).toBeInTheDocument()
    expect(screen.getByLabelText('Endereço')).toBeInTheDocument()
  })

  it('blocks auto-filled fields and shows feedback during lookup', () => {
    setup({ isPending: true })

    render(<DeliveryAddressFields />)

    expect(
      screen.getByRole('status', { name: /Buscando endereço/ })
    ).toBeInTheDocument()
    expect(screen.getByText('Buscando endereço pelo CEP…')).toBeInTheDocument()
    expect(screen.getByLabelText('Endereço')).toBeDisabled()
    expect(screen.getByLabelText('Bairro')).toBeDisabled()
    expect(screen.getByLabelText('Cidade')).toBeDisabled()
    expect(screen.getByLabelText('Estado')).toBeDisabled()
    expect(screen.getByLabelText('Número')).toBeEnabled()
  })

  it('fills the address returned by the zip code service', () => {
    const mutate = vi.fn(
      (_zipCode: string, options: { onSuccess: (found: object) => void }) =>
        options.onSuccess({
          street: 'Rua das Flores',
          neighborhood: 'Centro',
          city: 'Belém',
          state: 'PA',
        })
    )
    const { setValue, setFocus } = setup({ mutate })

    render(<DeliveryAddressFields />)
    fireEvent.change(screen.getByLabelText('CEP'), {
      target: { value: '66000-000' },
    })

    expect(mutate).toHaveBeenCalled()
    expect(setValue).toHaveBeenCalledWith(
      'guestStreet',
      'Rua das Flores',
      expect.any(Object)
    )
    expect(setFocus).toHaveBeenCalledWith('guestNumber')
  })
})
