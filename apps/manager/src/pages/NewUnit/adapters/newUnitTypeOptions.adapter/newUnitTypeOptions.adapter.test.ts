import { describe, expect, it } from 'vitest'

import { toNewUnitTypeOptions } from './newUnitTypeOptions.adapter'
import { newUnitStoreTypesMock } from './newUnitTypeOptions.adapter.mock'

describe('toNewUnitTypeOptions', () => {
  it('prefers the public description and falls back to the type name', () => {
    expect(
      toNewUnitTypeOptions([
        ...newUnitStoreTypesMock,
        { id: 'bar', name: 'Bar', description: null },
      ])
    ).toEqual([
      { value: 'restaurant', label: 'Restaurante' },
      { value: 'bar', label: 'Bar' },
    ])
  })
})
