import type { ReactNode } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AddressConfirmMap } from './AddressConfirmMap'
import {
  confirmedAddressMock,
  movedPinLocationMock,
} from './AddressConfirmMap.mock'

type LatLngLiteral = { lat: number; lng: number }

vi.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: ReactNode }) => children,
  Map: ({
    children,
    onClick,
  }: {
    children: ReactNode
    onClick: (event: { detail: { latLng: LatLngLiteral | null } }) => void
  }) => (
    <div>
      <button
        type="button"
        onClick={() =>
          onClick({ detail: { latLng: { lat: -1.36, lng: -48.38 } } })
        }
      >
        Mapa
      </button>
      <button
        type="button"
        onClick={() => onClick({ detail: { latLng: null } })}
      >
        Mapa sem ponto
      </button>
      {children}
    </div>
  ),
  Marker: ({
    position,
    draggable,
    onDragEnd,
  }: {
    position: LatLngLiteral
    draggable: boolean
    onDragEnd: (event: {
      latLng: { toJSON: () => LatLngLiteral } | null
    }) => void
  }) => (
    <button
      type="button"
      data-lat={position.lat}
      data-lng={position.lng}
      data-draggable={String(draggable)}
      onClick={() =>
        onDragEnd({ latLng: { toJSON: () => ({ lat: -1.36, lng: -48.38 }) } })
      }
    >
      Pino
    </button>
  ),
}))

const renderMap = (
  props: Partial<Parameters<typeof AddressConfirmMap>[0]> = {}
) =>
  render(
    <AddressConfirmMap
      address={confirmedAddressMock}
      isUpdatingAddress={false}
      onPinMove={vi.fn()}
      onConfirm={vi.fn()}
      onPickAnother={vi.fn()}
      {...props}
    />
  )

describe('AddressConfirmMap', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('shows a draggable pin on the picked coordinates', () => {
    // Arrange
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'browser-key')

    // Act
    renderMap()

    // Assert
    expect(
      screen.getByRole('group', { name: 'Mapa de Travessa WE-69-A, 1562' })
    ).toBeInTheDocument()
    const pin = screen.getByRole('button', { name: 'Pino' })
    expect(pin).toHaveAttribute('data-lat', '-1.35')
    expect(pin).toHaveAttribute('data-lng', '-48.37')
    expect(pin).toHaveAttribute('data-draggable', 'true')
    expect(
      screen.getByText(/Arraste o pino ou toque no mapa/)
    ).toBeInTheDocument()
    expect(screen.getByText('Coqueiro, Ananindeua - PA')).toBeInTheDocument()
  })

  it('reports the new coordinates when the pin is dropped', () => {
    // Arrange
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'browser-key')
    const onPinMove = vi.fn()
    renderMap({ onPinMove })

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Pino' }))

    // Assert
    expect(onPinMove).toHaveBeenCalledExactlyOnceWith(movedPinLocationMock)
  })

  it('moves the pin to the spot tapped on the map', () => {
    // Arrange
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'browser-key')
    const onPinMove = vi.fn()
    renderMap({ onPinMove })

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Mapa' }))

    // Assert
    expect(onPinMove).toHaveBeenCalledExactlyOnceWith(movedPinLocationMock)
  })

  it('ignores a map tap that carries no position', () => {
    // Arrange
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'browser-key')
    const onPinMove = vi.fn()
    renderMap({ onPinMove })

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Mapa sem ponto' }))

    // Assert
    expect(onPinMove).not.toHaveBeenCalled()
  })

  it('blocks the confirmation while the address of the new point is loading', () => {
    // Arrange
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'browser-key')

    // Act
    renderMap({ isUpdatingAddress: true })

    // Assert
    expect(
      screen.getByRole('button', { name: 'Confirmar endereço' })
    ).toBeDisabled()
    expect(
      screen.getByText('Atualizando o endereço do ponto…')
    ).toBeInTheDocument()
  })

  it('keeps the address confirmable without a Maps key', () => {
    // Arrange
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', '')

    // Act
    renderMap()

    // Assert
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Confirmar endereço' })
    ).toBeEnabled()
  })

  it('confirms the address', () => {
    // Arrange
    const onConfirm = vi.fn()
    renderMap({ onConfirm })

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar endereço' }))

    // Assert
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('goes back to the candidates', () => {
    // Arrange
    const onPickAnother = vi.fn()
    renderMap({ onPickAnother })

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Escolher outro' }))

    // Assert
    expect(onPickAnother).toHaveBeenCalledOnce()
  })
})
