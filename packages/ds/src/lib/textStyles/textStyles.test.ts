import { describe, expect, it } from 'vitest'

import { textAlignClasses, textColorClasses } from './textStyles'

describe('textStyles', () => {
  it('names a color for every entry, with no gap left behind', () => {
    // Arrange / Act
    const colors = Object.values(textColorClasses)

    // Assert
    expect(colors).toHaveLength(11)
    expect(colors.every(Boolean)).toBe(true)
  })

  it('reaches each color through a token, never a raw value', () => {
    // Arrange
    const arbitraryValue = /\[|#|rgb|hsl/

    // Act
    const offenders = Object.entries(textColorClasses).filter(([, className]) =>
      arbitraryValue.test(className)
    )

    // Assert
    expect(offenders).toEqual([])
  })

  it('keeps the hyphenated key, the one a typo would break silently', () => {
    // Arrange / Act
    const { brand, 'brand-strong': brandStrong } = textColorClasses

    // Assert
    expect(brand).toBe('text-brand')
    expect(brandStrong).toBe('text-brand-strong')
  })

  it('covers the three alignments a paragraph can take', () => {
    // Arrange / Act
    const alignments = Object.values(textAlignClasses)

    // Assert
    expect(alignments).toEqual(['text-left', 'text-center', 'text-right'])
  })
})
