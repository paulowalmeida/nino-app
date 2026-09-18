import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DeliveryRecipientFields } from './DeliveryRecipientFields'
import {
  addressPredictionMock,
  addressSearchResultMock,
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
        resolveSelectedAddress={vi.fn()}
        isResolvingSelectedAddress={false}
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
        resolveSelectedAddress={vi.fn()}
        isResolvingSelectedAddress={false}
      />
    )

    expect(
      screen.getByRole('textbox', { name: 'Nome de quem pediu' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('combobox', { name: 'Logradouro' })
    ).toBeInTheDocument()
  })

  it('lists the prediction description without exposing zip/neighborhood yet', () => {
    render(
      <DeliveryRecipientFields
        value={{
          ...deliveryRecipientMock,
          street: addressPredictionMock.mainText,
        }}
        addressSuggestions={[addressPredictionMock]}
        isSearchingAddress={false}
        onChange={vi.fn()}
        resolveSelectedAddress={vi.fn()}
        isResolvingSelectedAddress={false}
      />
    )

    const streetInput = screen.getByRole('combobox', { name: 'Logradouro' })
    fireEvent.click(streetInput)

    expect(streetInput).toHaveValue(addressPredictionMock.mainText)
    expect(
      screen.getByRole('option', {
        name: addressPredictionMock.description,
        hidden: true,
      })
    ).toBeInTheDocument()
  })

  it('resolves the full address once a prediction is selected', async () => {
    // Arrange: the guest has typed enough for one prediction to show.
    const onChange = vi.fn()
    const resolveSelectedAddress = vi
      .fn()
      .mockResolvedValue(addressSearchResultMock)
    render(
      <DeliveryRecipientFields
        value={{
          ...deliveryRecipientMock,
          street: addressPredictionMock.mainText,
        }}
        addressSuggestions={[addressPredictionMock]}
        isSearchingAddress={false}
        onChange={onChange}
        resolveSelectedAddress={resolveSelectedAddress}
        isResolvingSelectedAddress={false}
      />
    )

    // Act: select the only prediction in the list.
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    await user.click(screen.getByRole('combobox', { name: 'Logradouro' }))
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')

    // Assert: the details call resolved and populated the full address.
    await waitFor(() =>
      expect(resolveSelectedAddress).toHaveBeenCalledWith(
        addressPredictionMock.placeId
      )
    )
    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith({
        providerId: addressSearchResultMock.providerId,
        zipCode: addressSearchResultMock.zipCode,
        street: addressSearchResultMock.street,
        neighborhood: addressSearchResultMock.neighborhood,
        city: addressSearchResultMock.city,
        state: addressSearchResultMock.state,
        latitude: addressSearchResultMock.latitude,
        longitude: addressSearchResultMock.longitude,
      })
    )
  })

  it('shows a non-deliverable message when resolving the selection fails', async () => {
    // Arrange: the backend rejects this specific address as out of range.
    const resolveSelectedAddress = vi.fn().mockRejectedValue(new Error('422'))
    render(
      <DeliveryRecipientFields
        value={{
          ...deliveryRecipientMock,
          street: addressPredictionMock.mainText,
        }}
        addressSuggestions={[addressPredictionMock]}
        isSearchingAddress={false}
        onChange={vi.fn()}
        resolveSelectedAddress={resolveSelectedAddress}
        isResolvingSelectedAddress={false}
      />
    )

    // Act: select the only prediction in the list.
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    await user.click(screen.getByRole('combobox', { name: 'Logradouro' }))
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')

    // Assert: the guest sees why the address wasn't accepted.
    await waitFor(() =>
      expect(
        screen.getByText('A loja não entrega nesse endereço.')
      ).toBeInTheDocument()
    )
  })
})
