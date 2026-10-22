import { describe, expect, it } from 'vitest'

import { toZoneOptions } from './zoneOptions.adapter'
import { deliveryZonesMock } from './zoneOptions.adapter.mock'

describe(toZoneOptions.name, () => {
  it('labels the active zones by distance and fee', () => {
    expect(toZoneOptions(deliveryZonesMock)).toEqual([
      { value: 'zone-1', label: '0 a 3 km · taxa R$ 5,00' },
      { value: 'zone-2', label: '3 a 6,5 km · taxa R$ 9,00' },
    ])
  })
})
