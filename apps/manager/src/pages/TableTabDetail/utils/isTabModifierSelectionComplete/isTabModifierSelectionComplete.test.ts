import { describe, expect, it } from 'vitest'

import { isTabModifierSelectionComplete } from './isTabModifierSelectionComplete'
import { completeSelectionModifiersMock } from './isTabModifierSelectionComplete.mock'

describe('isTabModifierSelectionComplete', () => {
  it('accepts a selection that meets every minimum and maximum', () => {
    expect(
      isTabModifierSelectionComplete(completeSelectionModifiersMock, {
        'modifier-1': ['option-1'],
        'modifier-2': ['option-2', 'option-3'],
      })
    ).toBe(true)
  })

  it('accepts a missing optional group', () => {
    expect(
      isTabModifierSelectionComplete(completeSelectionModifiersMock, {
        'modifier-1': ['option-1'],
      })
    ).toBe(true)
  })

  it('rejects a required group left empty', () => {
    expect(
      isTabModifierSelectionComplete(completeSelectionModifiersMock, {})
    ).toBe(false)
  })

  it('rejects a group over its maximum', () => {
    expect(
      isTabModifierSelectionComplete(completeSelectionModifiersMock, {
        'modifier-1': ['option-1', 'option-2'],
      })
    ).toBe(false)
  })

  it('accepts a product without modifiers', () => {
    expect(isTabModifierSelectionComplete([], {})).toBe(true)
  })
})
