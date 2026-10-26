import { render } from '@testing-library/react'
import { useMap } from '@vis.gl/react-google-maps'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FitZoneBounds } from './FitZoneBounds'
import { fitZoneBoundsPropsMock } from './FitZoneBounds.mock'

vi.mock('@vis.gl/react-google-maps', () => ({ useMap: vi.fn() }))

describe('FitZoneBounds', () => {
  afterEach(() => {
    vi.mocked(useMap).mockReset()
  })

  it('fits the map to the outer delivery radius', () => {
    const fitBounds = vi.fn()
    vi.mocked(useMap).mockReturnValue({
      fitBounds,
    } as unknown as google.maps.Map)

    render(<FitZoneBounds {...fitZoneBoundsPropsMock} />)

    expect(fitBounds).toHaveBeenCalledTimes(1)
    const [bounds, padding] = fitBounds.mock.calls[0]
    expect(bounds.north).toBeCloseTo(1)
    expect(bounds.west).toBeCloseTo(-1)
    expect(padding).toBe(16)
  })

  it('waits for the map instance before fitting', () => {
    vi.mocked(useMap).mockReturnValue(null)

    const { container } = render(<FitZoneBounds {...fitZoneBoundsPropsMock} />)

    expect(container).toBeEmptyDOMElement()
  })
})
