import type { ReactNode } from 'react'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'

import { DeliveryRecipientFields } from './DeliveryRecipientFields'
import {
  addressAtFirstPointMock,
  addressAtSecondPointMock,
  addressPredictionMock,
  addressSearchResultMock,
  deliveryRecipientMock,
} from './DeliveryRecipientFields.mock'

type MapClick = (event: {
  detail: { latLng: { lat: number; lng: number } }
}) => void

vi.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: ReactNode }) => children,
  Map: ({ children, onClick }: { children: ReactNode; onClick: MapClick }) => (
    <div>
      <button
        type="button"
        onClick={() =>
          onClick({ detail: { latLng: { lat: -1.36, lng: -48.38 } } })
        }
      >
        Ponto A
      </button>
      <button
        type="button"
        onClick={() =>
          onClick({ detail: { latLng: { lat: -1.37, lng: -48.39 } } })
        }
      >
        Ponto B
      </button>
      {children}
    </div>
  ),
  Marker: () => null,
}))

const typedAddress = {
  ...deliveryRecipientMock,
  street: addressPredictionMock.mainText,
  number: addressSearchResultMock.number,
}

const deferred = () => {
  let resolve: (address: AddressSearchResult) => void = () => undefined
  let reject: (error: Error) => void = () => undefined
  const promise = new Promise<AddressSearchResult>((done, fail) => {
    resolve = done
    reject = fail
  })
  return { promise, resolve, reject }
}

const renderOnConfirmation = (
  resolveAddressAtPoint: (location: {
    latitude: number
    longitude: number
  }) => Promise<AddressSearchResult>,
  onChange = vi.fn()
) => {
  render(
    <DeliveryRecipientFields
      value={typedAddress}
      addressSuggestions={[addressPredictionMock]}
      isSearchingAddress={false}
      onChange={onChange}
      resolveSelectedAddress={vi
        .fn()
        .mockResolvedValue(addressSearchResultMock)}
      resolveAddressAtPoint={resolveAddressAtPoint}
      isResolvingSelectedAddress={false}
      addressLookupRequested
    />
  )
  fireEvent.click(screen.getByText(addressPredictionMock.mainText))
  return onChange
}

describe('DeliveryRecipientFields moving the pin', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'browser-key')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('confirms the address found at the moved pin, with the pin coordinates', async () => {
    // Arrange
    const resolveAddressAtPoint = vi
      .fn()
      .mockResolvedValue(addressAtFirstPointMock)
    const onChange = renderOnConfirmation(resolveAddressAtPoint)

    // Act
    fireEvent.click(await screen.findByRole('button', { name: 'Ponto A' }))
    await screen.findByText(/Travessa WE-70/)
    fireEvent.click(
      await screen.findByRole('button', { name: 'Confirmar endereço' })
    )

    // Assert
    expect(resolveAddressAtPoint).toHaveBeenCalledWith({
      latitude: -1.36,
      longitude: -48.38,
    })
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        providerId: addressAtFirstPointMock.providerId,
        street: 'Travessa WE-70',
        number: '',
        latitude: -1.36,
        longitude: -48.38,
      })
    )
  })

  it('blocks the confirmation until the address of the new point is known', async () => {
    // Arrange
    const pendingAddress = deferred()
    renderOnConfirmation(vi.fn().mockReturnValue(pendingAddress.promise))

    // Act
    fireEvent.click(await screen.findByRole('button', { name: 'Ponto A' }))

    // Assert
    expect(
      await screen.findByRole('button', { name: 'Confirmar endereço' })
    ).toBeDisabled()
    pendingAddress.resolve(addressAtFirstPointMock)
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Confirmar endereço' })
      ).toBeEnabled()
    )
  })

  it('restores the previous address and warns when the new point cannot be used', async () => {
    // Arrange
    const onChange = renderOnConfirmation(
      vi.fn().mockRejectedValue(new Error('422'))
    )

    // Act
    fireEvent.click(await screen.findByRole('button', { name: 'Ponto A' }))
    await screen.findByText(/sem endereço ou fora da área de entrega/)
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar endereço' }))

    // Assert
    expect(screen.queryByText(/Travessa WE-70/)).not.toBeInTheDocument()
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        street: addressSearchResultMock.street,
        latitude: addressSearchResultMock.latitude,
        longitude: addressSearchResultMock.longitude,
      })
    )
  })

  it('ignores the answer of an earlier move once the pin moved again', async () => {
    // Arrange
    const firstAnswer = deferred()
    const resolveAddressAtPoint = vi
      .fn()
      .mockReturnValueOnce(firstAnswer.promise)
      .mockResolvedValueOnce(addressAtSecondPointMock)
    renderOnConfirmation(resolveAddressAtPoint)

    // Act
    fireEvent.click(await screen.findByRole('button', { name: 'Ponto A' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Ponto B' }))
    await screen.findByText(/Travessa WE-71/)
    firstAnswer.resolve(addressAtFirstPointMock)

    // Assert
    await waitFor(() =>
      expect(screen.getByText(/Travessa WE-71/)).toBeInTheDocument()
    )
    expect(screen.queryByText(/Travessa WE-70/)).not.toBeInTheDocument()
  })

  it('drops a pending move when the operator picks another address', async () => {
    // Arrange
    const pendingAddress = deferred()
    renderOnConfirmation(vi.fn().mockReturnValue(pendingAddress.promise))
    fireEvent.click(await screen.findByRole('button', { name: 'Ponto A' }))

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Escolher outro' }))
    pendingAddress.resolve(addressAtFirstPointMock)

    // Assert
    expect(
      await screen.findByText(addressPredictionMock.mainText)
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.queryByText(/Travessa WE-70/)).not.toBeInTheDocument()
    )
  })

  it('ignores the failure of an earlier move once the pin moved again', async () => {
    // Arrange
    const firstFailure = deferred()
    const resolveAddressAtPoint = vi
      .fn()
      .mockReturnValueOnce(firstFailure.promise)
      .mockResolvedValueOnce(addressAtSecondPointMock)
    renderOnConfirmation(resolveAddressAtPoint)

    // Act
    fireEvent.click(await screen.findByRole('button', { name: 'Ponto A' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Ponto B' }))
    await screen.findByText(/Travessa WE-71/)
    firstFailure.reject(new Error('422'))

    // Assert
    await waitFor(() =>
      expect(screen.getByText(/Travessa WE-71/)).toBeInTheDocument()
    )
    expect(
      screen.queryByText(/sem endereço ou fora da área de entrega/)
    ).not.toBeInTheDocument()
  })

  it('goes back to the address before the first move when a later move fails', async () => {
    // Arrange
    const resolveAddressAtPoint = vi
      .fn()
      .mockResolvedValueOnce(addressAtFirstPointMock)
      .mockRejectedValueOnce(new Error('404'))
    renderOnConfirmation(resolveAddressAtPoint)
    fireEvent.click(await screen.findByRole('button', { name: 'Ponto A' }))
    await screen.findByText(/Travessa WE-70/)

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Ponto B' }))

    // Assert
    await screen.findByText(/sem endereço ou fora da área de entrega/)
    expect(screen.getByText(/Travessa WE-70/)).toBeInTheDocument()
  })
})
