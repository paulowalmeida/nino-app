import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DeliveryMap } from './DeliveryMap'
import { deliveryZonesMock, unitCoordinatesMock } from './DeliveryMap.mock'

type CircleStub = {
  radius: number
  strokeWeight: number
  fillOpacity: number
}

vi.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: ReactNode }) => children,
  Map: ({ children }: { children: ReactNode }) => (
    <div data-testid="google-map">{children}</div>
  ),
  Circle: ({ radius, strokeWeight, fillOpacity }: CircleStub) => (
    <span
      data-testid="delivery-ring"
      data-radius={radius}
      data-stroke-weight={strokeWeight}
      data-fill-opacity={fillOpacity}
    />
  ),
  Marker: ({ title }: { title: string }) => <span title={title} />,
  useMap: () => null,
}))

const renderedRings = () =>
  screen.getAllByTestId('delivery-ring').map((ring) => ({
    radius: Number(ring.dataset.radius),
    strokeWeight: Number(ring.dataset.strokeWeight),
    fillOpacity: Number(ring.dataset.fillOpacity),
  }))

describe('DeliveryMap', () => {
  beforeEach(() => {
    vi.stubGlobal('google', { maps: { SymbolPath: { CIRCLE: 0 } } })
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'browser-key')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('draws one ring per delivery zone around the unit', () => {
    render(
      <DeliveryMap
        zones={deliveryZonesMock}
        coordinates={unitCoordinatesMock}
      />
    )

    expect(
      screen.getByRole('img', { name: 'Mapa das áreas de entrega' })
    ).toBeInTheDocument()
    expect(screen.getByTitle('Unidade')).toBeInTheDocument()
    expect(renderedRings()).toEqual([
      { radius: 2000, strokeWeight: 2, fillOpacity: 0.1 },
      { radius: 4000, strokeWeight: 1, fillOpacity: 0.03 },
    ])
  })

  it('highlights the focused zone and draws the new range preview', () => {
    render(
      <DeliveryMap
        zones={deliveryZonesMock}
        coordinates={unitCoordinatesMock}
        focusedZoneId="zone-bairros"
        previewKm={6}
      />
    )

    expect(renderedRings()).toEqual([
      { radius: 2000, strokeWeight: 2, fillOpacity: 0.1 },
      { radius: 4000, strokeWeight: 3, fillOpacity: 0.2 },
      { radius: 6000, strokeWeight: 2, fillOpacity: 0.06 },
    ])
  })

  it('explains that the unit address could not be located', () => {
    render(<DeliveryMap zones={deliveryZonesMock} coordinates={null} />)

    expect(screen.queryByTestId('google-map')).not.toBeInTheDocument()
    expect(
      screen.getByText(/Não foi possível localizar o endereço da unidade/)
    ).toBeInTheDocument()
  })

  it('hides the map when the Google Maps key is not configured', () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', '')

    render(
      <DeliveryMap
        zones={deliveryZonesMock}
        coordinates={unitCoordinatesMock}
      />
    )

    expect(screen.queryByTestId('google-map')).not.toBeInTheDocument()
    expect(
      screen.getByText('O mapa não está disponível no momento.')
    ).toBeInTheDocument()
  })
})
