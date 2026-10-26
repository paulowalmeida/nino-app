import { render, screen } from '@testing-library/react'
import { useApiIsLoaded } from '@vis.gl/react-google-maps'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { UnitMarker } from './UnitMarker'
import { unitMarkerPropsMock } from './UnitMarker.mock'

vi.mock('@vis.gl/react-google-maps', () => ({
  useApiIsLoaded: vi.fn(),
  Marker: ({ title, icon }: { title: string; icon: { path: number } }) => (
    <span title={title} data-icon-path={icon.path} />
  ),
}))

describe('UnitMarker', () => {
  afterEach(() => {
    vi.mocked(useApiIsLoaded).mockReset()
    vi.unstubAllGlobals()
  })

  it('renders nothing while the Google Maps API is still loading', () => {
    vi.mocked(useApiIsLoaded).mockReturnValue(false)

    expect(() => render(<UnitMarker {...unitMarkerPropsMock} />)).not.toThrow()
    expect(screen.queryByTitle('Unidade')).not.toBeInTheDocument()
  })

  it('draws the unit as a circle once the Google Maps API is loaded', () => {
    vi.stubGlobal('google', { maps: { SymbolPath: { CIRCLE: 0 } } })
    vi.mocked(useApiIsLoaded).mockReturnValue(true)

    render(<UnitMarker {...unitMarkerPropsMock} />)

    expect(screen.getByTitle('Unidade')).toHaveAttribute('data-icon-path', '0')
  })
})
