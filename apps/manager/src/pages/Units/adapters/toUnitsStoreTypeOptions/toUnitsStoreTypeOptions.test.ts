import { describe, expect, it } from 'vitest'

import { toUnitsStoreTypeOptions } from './toUnitsStoreTypeOptions'
import { unitsStoreTypeOptionsMock } from './toUnitsStoreTypeOptions.mock'

describe(toUnitsStoreTypeOptions.name, () => {
  it('falls back to the type name when there is no description', () => {
    expect(toUnitsStoreTypeOptions(unitsStoreTypeOptionsMock)).toEqual([
      { value: 'restaurant', label: 'Restaurante' },
    ])
  })
})
