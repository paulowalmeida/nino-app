import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AddressConfirmMap } from './AddressConfirmMap'
import { confirmedAddressMock } from './AddressConfirmMap.mock'

describe('AddressConfirmMap', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('pins the picked coordinates on Google Maps', () => {
    // Arrange
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'browser-key')

    // Act
    render(
      <AddressConfirmMap
        address={confirmedAddressMock}
        onConfirm={vi.fn()}
        onPickAnother={vi.fn()}
      />
    )

    // Assert
    const map = screen.getByTitle('Mapa de Travessa WE-69-A, 1562')
    const mapUrl = new URL(map.getAttribute('src') ?? '')
    expect(mapUrl.origin + mapUrl.pathname).toBe(
      'https://www.google.com/maps/embed/v1/place'
    )
    expect(mapUrl.searchParams.get('key')).toBe('browser-key')
    expect(mapUrl.searchParams.get('q')).toBe('-1.35,-48.37')
    expect(screen.getByText('Coqueiro, Ananindeua - PA')).toBeInTheDocument()
  })

  it('keeps the address confirmable without a Maps key', () => {
    // Arrange
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', '')

    // Act
    render(
      <AddressConfirmMap
        address={confirmedAddressMock}
        onConfirm={vi.fn()}
        onPickAnother={vi.fn()}
      />
    )

    // Assert
    expect(
      screen.queryByTitle('Mapa de Travessa WE-69-A, 1562')
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Confirmar endereço' })
    ).toBeInTheDocument()
  })

  it('confirms the address', () => {
    // Arrange
    const onConfirm = vi.fn()
    render(
      <AddressConfirmMap
        address={confirmedAddressMock}
        onConfirm={onConfirm}
        onPickAnother={vi.fn()}
      />
    )

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar endereço' }))

    // Assert
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('goes back to the candidates', () => {
    // Arrange
    const onPickAnother = vi.fn()
    render(
      <AddressConfirmMap
        address={confirmedAddressMock}
        onConfirm={vi.fn()}
        onPickAnother={onPickAnother}
      />
    )

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Escolher outro' }))

    // Assert
    expect(onPickAnother).toHaveBeenCalledOnce()
  })
})
