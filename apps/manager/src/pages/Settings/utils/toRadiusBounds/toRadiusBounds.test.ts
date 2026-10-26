import { describe, expect, it } from 'vitest'

import { toRadiusBounds } from './toRadiusBounds'
import { equatorCenterMock, saoPauloCenterMock } from './toRadiusBounds.mock'

describe('toRadiusBounds', () => {
  it('spans the radius evenly around the center on the equator', () => {
    const bounds = toRadiusBounds(equatorCenterMock, 111.32)

    expect(bounds.north).toBeCloseTo(1)
    expect(bounds.south).toBeCloseTo(-1)
    expect(bounds.east).toBeCloseTo(1)
    expect(bounds.west).toBeCloseTo(-1)
  })

  it('widens the longitude span away from the equator', () => {
    const bounds = toRadiusBounds(saoPauloCenterMock, 5)
    const latitudeSpan = bounds.north - bounds.south
    const longitudeSpan = bounds.east - bounds.west

    expect(longitudeSpan).toBeGreaterThan(latitudeSpan)
    expect((bounds.north + bounds.south) / 2).toBeCloseTo(
      saoPauloCenterMock.latitude
    )
    expect((bounds.east + bounds.west) / 2).toBeCloseTo(
      saoPauloCenterMock.longitude
    )
  })
})
