import { describe, expect, it } from 'vitest'

import type { ProductChoicesState } from '@pages/Storefront/ProductDetail/types/ProductChoicesState.type'
import { toggleChoice } from './selection'

const applyUpdate = (
  initialSelections: Record<string, string[]>,
  optionId: string
) => {
  let state = { selections: initialSelections } as ProductChoicesState

  toggleChoice(
    (update) => {
      const partial =
        typeof update === 'function' ? update(state) : update
      state = { ...state, ...partial }
    },
    'extras',
    optionId,
    2
  )

  return state.selections.extras
}

describe('toggleChoice', () => {
  it('keeps existing choices when the maximum is reached', () => {
    expect(applyUpdate({ extras: ['cheese', 'bacon'] }, 'onion')).toEqual([
      'cheese',
      'bacon',
    ])
  })

  it('removes an existing choice without affecting the other choices', () => {
    expect(applyUpdate({ extras: ['cheese', 'bacon'] }, 'cheese')).toEqual([
      'bacon',
    ])
  })
})
