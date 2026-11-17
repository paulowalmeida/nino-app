import { describe, expect, it } from 'vitest'

import { selectionsFromModifiers } from './selections-from-modifiers'
import { selectionsFromModifiersMock } from './selections-from-modifiers.mock'

const { product, modifiers } = selectionsFromModifiersMock

describe('selectionsFromModifiers', () => {
  it('groups the chosen options by modifier group', () => {
    expect(selectionsFromModifiers(product, modifiers)).toEqual({
      ponto: ['bem'],
      extras: ['bacon', 'ovo'],
    })
  })

  it('returns no selections for a line without modifiers', () => {
    expect(selectionsFromModifiers(product)).toEqual({})
  })
})
