import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DeliveryRecipientFields } from './DeliveryRecipientFields'
import {
  addressPredictionMock,
  addressSearchResultMock,
  addressWithoutNumberMock,
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
        resolveAddressAtPoint={vi.fn()}
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
        resolveAddressAtPoint={vi.fn()}
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
        resolveAddressAtPoint={vi.fn()}
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
        resolveAddressAtPoint={vi.fn()}
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
        resolveAddressAtPoint={vi.fn()}
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
        resolveAddressAtPoint={vi.fn()}
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
        resolveAddressAtPoint={vi.fn()}
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
        resolveAddressAtPoint={vi.fn()}
        resolveSelectedAddress={vi.fn()}
        isResolvingSelectedAddress={false}
        addressLookupRequested
      />
    )

    expect(screen.getByText(/Nenhum endereço encontrado/)).toBeInTheDocument()
  })

  it('shows the picked address on the map before filling the fields', async () => {
    // Arrange
    const onChange = vi.fn()
    const onAddressLookupRequested = vi.fn()
    render(
      <DeliveryRecipientFields
        value={typedAddress}
        addressSuggestions={[addressPredictionMock]}
        isSearchingAddress={false}
        onChange={onChange}
        resolveAddressAtPoint={vi.fn()}
        resolveSelectedAddress={vi
          .fn()
          .mockResolvedValue(addressSearchResultMock)}
        isResolvingSelectedAddress={false}
        addressLookupRequested
        onAddressLookupRequested={onAddressLookupRequested}
      />
    )

    // Act
    fireEvent.click(screen.getByText(addressPredictionMock.mainText))

    // Assert
    expect(
      await screen.findByRole('button', { name: 'Confirmar endereço' })
    ).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
    expect(onAddressLookupRequested).not.toHaveBeenCalled()
  })

  it('goes back to the candidates when the pin is wrong', async () => {
    // Arrange
    render(
      <DeliveryRecipientFields
        value={typedAddress}
        addressSuggestions={[addressPredictionMock]}
        isSearchingAddress={false}
        onChange={vi.fn()}
        resolveAddressAtPoint={vi.fn()}
        resolveSelectedAddress={vi
          .fn()
          .mockResolvedValue(addressSearchResultMock)}
        isResolvingSelectedAddress={false}
        addressLookupRequested
      />
    )
    fireEvent.click(screen.getByText(addressPredictionMock.mainText))

    // Act
    fireEvent.click(
      await screen.findByRole('button', { name: 'Escolher outro' })
    )

    // Assert
    expect(screen.getByText(addressPredictionMock.mainText)).toBeInTheDocument()
  })

  it('resolves the full address once the pin is confirmed', async () => {
    // Arrange
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
        resolveAddressAtPoint={vi.fn()}
        resolveSelectedAddress={resolveSelectedAddress}
        isResolvingSelectedAddress={false}
        addressLookupRequested
        onAddressLookupRequested={onAddressLookupRequested}
      />
    )

    // Act
    fireEvent.click(screen.getByText(addressPredictionMock.mainText))
    fireEvent.click(
      await screen.findByRole('button', { name: 'Confirmar endereço' })
    )

    // Assert
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
    // Arrange
    const resolveSelectedAddress = vi.fn().mockRejectedValue(new Error('422'))
    render(
      <DeliveryRecipientFields
        value={typedAddress}
        addressSuggestions={[addressPredictionMock]}
        isSearchingAddress={false}
        onChange={vi.fn()}
        resolveAddressAtPoint={vi.fn()}
        resolveSelectedAddress={resolveSelectedAddress}
        isResolvingSelectedAddress={false}
        addressLookupRequested
      />
    )

    // Act
    fireEvent.click(screen.getByText(addressPredictionMock.mainText))

    // Assert
    await waitFor(() =>
      expect(
        screen.getByText('A loja não entrega nesse endereço.')
      ).toBeInTheDocument()
    )
  })

  it('keeps the typed number when the provider returns none', async () => {
    // Arrange
    const onChange = vi.fn()
    render(
      <DeliveryRecipientFields
        value={typedAddress}
        addressSuggestions={[addressPredictionMock]}
        isSearchingAddress={false}
        onChange={onChange}
        resolveAddressAtPoint={vi.fn()}
        resolveSelectedAddress={vi
          .fn()
          .mockResolvedValue(addressWithoutNumberMock)}
        isResolvingSelectedAddress={false}
        addressLookupRequested
      />
    )

    // Act
    fireEvent.click(screen.getByText(addressPredictionMock.mainText))
    fireEvent.click(
      await screen.findByRole('button', { name: 'Confirmar endereço' })
    )

    // Assert
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ number: typedAddress.number })
    )
  })

  it('leaves the confirmation without filling the address', async () => {
    // Arrange
    const onChange = vi.fn()
    const onAddressLookupRequested = vi.fn()
    render(
      <DeliveryRecipientFields
        value={typedAddress}
        addressSuggestions={[addressPredictionMock]}
        isSearchingAddress={false}
        onChange={onChange}
        resolveAddressAtPoint={vi.fn()}
        resolveSelectedAddress={vi
          .fn()
          .mockResolvedValue(addressSearchResultMock)}
        isResolvingSelectedAddress={false}
        addressLookupRequested
        onAddressLookupRequested={onAddressLookupRequested}
      />
    )
    fireEvent.click(screen.getByText(addressPredictionMock.mainText))
    await screen.findByRole('button', { name: 'Confirmar endereço' })

    // Act
    fireEvent.click(screen.getByRole('button', { name: /Confirme o endereço/ }))

    // Assert
    expect(onAddressLookupRequested).toHaveBeenCalledWith(false)
    expect(onChange).not.toHaveBeenCalled()
  })
})
