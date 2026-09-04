import { describe, expect, it } from 'vitest'

import { toContrastRatio } from './toContrastRatio'
import { contrastPairsMock } from './toContrastRatio.mock'

describe('toContrastRatio', () => {
  it('returns the WCAG extremes for black on white and white on white', () => {
    const { blackOnWhite, whiteOnWhite } = contrastPairsMock

    expect(
      toContrastRatio(blackOnWhite.foreground, blackOnWhite.background)
    ).toBeCloseTo(blackOnWhite.ratio, 2)
    expect(
      toContrastRatio(whiteOnWhite.foreground, whiteOnWhite.background)
    ).toBeCloseTo(whiteOnWhite.ratio, 2)
  })

  it('reads three-digit hex the same as its expanded form', () => {
    const { shorthandBlackOnWhite } = contrastPairsMock

    expect(
      toContrastRatio(
        shorthandBlackOnWhite.foreground,
        shorthandBlackOnWhite.background
      )
    ).toBeCloseTo(shorthandBlackOnWhite.ratio, 2)
  })

  it('reports no contrast when a color cannot be read', () => {
    const { invalid } = contrastPairsMock

    expect(toContrastRatio(invalid.foreground, invalid.background)).toBe(
      invalid.ratio
    )
  })

  it('does not depend on the order of the two colors', () => {
    expect(toContrastRatio('#FF6B00', '#FFFFFF')).toBeCloseTo(
      toContrastRatio('#FFFFFF', '#FF6B00'),
      6
    )
  })
})
