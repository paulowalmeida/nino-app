import { describe, expect, it } from 'vitest'

import { marginToClasses } from './spacing'

describe('marginToClasses', () => {
  it('returns nothing when no margin is given', () => {
    // Arrange / Act
    const classes = marginToClasses({})

    // Assert
    expect(classes).toEqual([])
  })

  it('treats a plain number as the value for every screen', () => {
    // Arrange / Act
    const classes = marginToClasses({ mb: 5 })

    // Assert
    expect(classes).toEqual(['mb-5'])
  })

  it('keeps a mobile-only value unprefixed, so it holds everywhere', () => {
    // Arrange / Act
    const classes = marginToClasses({ mb: { mobile: 3 } })

    // Assert
    expect(classes).toEqual(['mb-3'])
  })

  it('prefixes the desktop value and leaves mobile as the fallback', () => {
    // Arrange / Act
    const classes = marginToClasses({ mb: { mobile: 3, desktop: 6 } })

    // Assert
    expect(classes).toEqual(['mb-3', 'lg:mb-6'])
  })

  it('accepts a desktop value with no mobile counterpart', () => {
    // Arrange / Act
    const classes = marginToClasses({ mt: { desktop: 10 } })

    // Assert
    expect(classes).toEqual(['lg:mt-10'])
  })

  it('combines every side into one list', () => {
    // Arrange / Act
    const classes = marginToClasses({ mt: 2, mb: { desktop: 8 }, mx: 4 })

    // Assert
    expect(classes).toEqual(['mt-2', 'lg:mb-8', 'mx-4'])
  })
})
