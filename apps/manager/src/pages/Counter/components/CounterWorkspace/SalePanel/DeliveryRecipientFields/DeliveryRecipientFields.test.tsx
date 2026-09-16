import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DeliveryRecipientFields } from './DeliveryRecipientFields'
import {
  addressSuggestionMock,
  deliveryRecipientMock,
} from './DeliveryRecipientFields.mock'

describe('DeliveryRecipientFields', () => {
  it.each([
    ['91982071243', '(91) 98207-1243'],
    ['9132071243', '(91) 3207-1243'],
  ])('masks delivery phone %s', (phone, maskedPhone) => {
    const onChange = vi.fn()
    render(
      <DeliveryRecipientFields
        value={deliveryRecipientMock}
        addressSuggestions={[]}
        isSearchingAddress={false}
        onChange={onChange}
      />
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Telefone' }), {
      target: { value: phone },
    })
    expect(onChange).toHaveBeenCalledWith({ phone: maskedPhone })
  })
  it('renders recipient and configured delivery city fields', () => {
    render(
      <DeliveryRecipientFields
        value={deliveryRecipientMock}
        addressSuggestions={[]}
        isSearchingAddress={false}
        onChange={vi.fn()}
      />
    )

    expect(
      screen.getByRole('textbox', { name: 'Nome de quem pediu' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('combobox', { name: 'Logradouro' })
    ).toBeInTheDocument()
  })

  it('keeps neighborhood and zip code only in the address option', () => {
    render(
      <DeliveryRecipientFields
        value={{ ...deliveryRecipientMock, ...addressSuggestionMock }}
        addressSuggestions={[addressSuggestionMock]}
        isSearchingAddress={false}
        onChange={vi.fn()}
      />
    )

    const streetInput = screen.getByRole('combobox', { name: 'Logradouro' })
    fireEvent.click(streetInput)

    expect(streetInput).toHaveValue(addressSuggestionMock.street)
    expect(
      screen.getByRole('option', {
        name: `${addressSuggestionMock.street} · ${addressSuggestionMock.neighborhood} · ${addressSuggestionMock.zipCode}`,
        hidden: true,
      })
    ).toBeInTheDocument()
  })
})
