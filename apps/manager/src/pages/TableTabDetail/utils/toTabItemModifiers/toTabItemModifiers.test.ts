import { describe, expect, it } from 'vitest'

import { toTabItemModifiers } from './toTabItemModifiers'
import { toTabItemModifiersMock } from './toTabItemModifiers.mock'

describe('toTabItemModifiers', () => {
  it('flattens every chosen option into one request line each', () => {
    expect(toTabItemModifiers(toTabItemModifiersMock.selection)).toEqual([
      { optionId: 'option-1', quantity: 1 },
      { optionId: 'option-2', quantity: 1 },
      { optionId: 'option-3', quantity: 1 },
    ])
  })

  it('sends nothing for an empty selection', () => {
    expect(toTabItemModifiers({})).toEqual([])
  })
})
