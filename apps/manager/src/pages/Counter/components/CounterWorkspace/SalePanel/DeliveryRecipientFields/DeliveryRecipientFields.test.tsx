import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DeliveryRecipientFields } from './DeliveryRecipientFields'
import {
  addressPredictionMock,
  addressSearchResultMock,
  deliveryRecipientMock,
} from './DeliveryRecipientFields.mock'

const typedAddress = {
  ...deliveryRecipientMock,
  street: addressPredictionMock.mainText,
  number: addressSearchResultMock.number,
}

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

  it('asks for the address as plain fields, with no suggestion preview', () => {
    render(
      <DeliveryRecipientFields
        value={typedAddress}
        addressSuggestions={[addressPredictionMock]}
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
      screen.getByRole('textbox', { name: 'Endereço' })
    ).toBeInTheDocument()
    expect(
      screen.queryByText(addressPredictionMock.secondaryText)
    ).not.toBeInTheDocument()
  })

  it('requests the lookup once street and number are filled', () => {
    const onAddressLookupRequested = vi.fn()
    render(
      <DeliveryRecipientFields
        value={typedAddress}
        addressSuggestions={[]}
        isSearchingAddress={false}
        onChange={vi.fn()}
        resolveSelectedAddress={vi.fn()}
        isResolvingSelectedAddress={false}
        onAddressLookupRequested={onAddressLookupRequested}
      />
    )

    fireEvent.blur(screen.getByRole('textbox', { name: 'Endereço' }))

    expect(onAddressLookupRequested).toHaveBeenCalledWith(true)
  })

  it('does not search again when nothing was edited', () => {
    const onAddressLookupRequested = vi.fn()
    render(
      <DeliveryRecipientFields
        value={typedAddress}
        addressSuggestions={[]}
        isSearchingAddress={false}
        onChange={vi.fn()}
        resolveSelectedAddress={vi.fn()}
        isResolvingSelectedAddress={false}
        onAddressLookupRequested={onAddressLookupRequested}
      />
    )
    const street = screen.getByRole('textbox', { name: 'Endereço' })

    fireEvent.blur(street)
    fireEvent.blur(street)

    expect(onAddressLookupRequested).toHaveBeenCalledTimes(1)
  })

  it('fills the fields behind a skeleton while the choice resolves', () => {
    render(
      <DeliveryRecipientFields
        value={typedAddress}
        addressSuggestions={[]}
        isSearchingAddress={false}
        onChange={vi.fn()}
        resolveSelectedAddress={vi.fn()}
        isResolvingSelectedAddress
      />
    )

    expect(
      screen.getByText('Preenchendo o endereço escolhido…')
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('textbox', { name: 'Endereço' })
    ).not.toBeInTheDocument()
  })

  it('waits for the search inside the confirmation dialog', () => {
    render(
      <DeliveryRecipientFields
        value={typedAddress}
        addressSuggestions={[]}
        isSearchingAddress
        onChange={vi.fn()}
        resolveSelectedAddress={vi.fn()}
        isResolvingSelectedAddress={false}
        addressLookupRequested
      />
    )

    expect(
      screen.getByText(
        `Procurando ${typedAddress.street}, ${typedAddress.number}…`
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Nenhum endereço encontrado/)
    ).not.toBeInTheDocument()
  })

  it('lists what the provider found once the search settles', () => {
    render(
      <DeliveryRecipientFields
        value={typedAddress}
        addressSuggestions={[addressPredictionMock]}
        isSearchingAddress={false}
        onChange={vi.fn()}
        resolveSelectedAddress={vi.fn()}
        isResolvingSelectedAddress={false}
        addressLookupRequested
      />
    )

    expect(
      screen.getByText(addressPredictionMock.secondaryText)
    ).toBeInTheDocument()
  })

  it('tells the attendant when the search came back empty', () => {
    render(
      <DeliveryRecipientFields
        value={typedAddress}
        addressSuggestions={[]}
        isSearchingAddress={false}
        onChange={vi.fn()}
        resolveSelectedAddress={vi.fn()}
        isResolvingSelectedAddress={false}
        addressLookupRequested
      />
    )

    expect(screen.getByText(/Nenhum endereço encontrado/)).toBeInTheDocument()
  })

  it('resolves the full address once a prediction is selected', async () => {
    // Arrange: the search came back with one candidate.
    const onChange = vi.fn()
    const onAddressLookupRequested = vi.fn()
    const resolveSelectedAddress = vi
      .fn()
      .mockResolvedValue(addressSearchResultMock)
    render(
      <DeliveryRecipientFields
        value={typedAddress}
        addressSuggestions={[addressPredictionMock]}
        isSearchingAddress={false}
        onChange={onChange}
        resolveSelectedAddress={resolveSelectedAddress}
        isResolvingSelectedAddress={false}
        addressLookupRequested
        onAddressLookupRequested={onAddressLookupRequested}
      />
    )

    // Act: pick the candidate.
    fireEvent.click(screen.getByText(addressPredictionMock.mainText))

    // Assert: the details call populated the address and closed the dialog.
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
        number: addressSearchResultMock.number,
        neighborhood: addressSearchResultMock.neighborhood,
        city: addressSearchResultMock.city,
        state: addressSearchResultMock.state,
        latitude: addressSearchResultMock.latitude,
        longitude: addressSearchResultMock.longitude,
      })
    )
    await waitFor(() =>
      expect(onAddressLookupRequested).toHaveBeenCalledWith(false)
    )
  })

  it('warns when the store cannot deliver to the picked address', async () => {
    // Arrange: the backend rejects this specific address as out of range.
    const resolveSelectedAddress = vi.fn().mockRejectedValue(new Error('422'))
    render(
      <DeliveryRecipientFields
        value={typedAddress}
        addressSuggestions={[addressPredictionMock]}
        isSearchingAddress={false}
        onChange={vi.fn()}
        resolveSelectedAddress={resolveSelectedAddress}
        isResolvingSelectedAddress={false}
        addressLookupRequested
      />
    )

    // Act: pick the candidate the store cannot deliver to.
    fireEvent.click(screen.getByText(addressPredictionMock.mainText))

    // Assert: the attendant sees why the address wasn't accepted.
    await waitFor(() =>
      expect(
        screen.getByText('A loja não entrega nesse endereço.')
      ).toBeInTheDocument()
    )
  })
})
