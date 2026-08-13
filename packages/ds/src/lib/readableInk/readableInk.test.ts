import { describe, expect, it } from 'vitest'

import { readableInk } from './readableInk'

const WHITE_INK = '#FFFFFF'
const DARK_INK = '#1A1206'

describe(readableInk.name, () => {
  it('puts white ink over the nino brand orange', () => {
    // Arrange / Act
    const ink = readableInk('#FF6B00')

    // Assert
    expect(ink).toBe(WHITE_INK)
  })

  it('puts dark ink over a pale tint a store may pick', () => {
    // Arrange / Act
    const ink = readableInk('#FFD230')

    // Assert
    expect(ink).toBe(DARK_INK)
  })

  it('weighs green heavier than blue, as the eye does', () => {
    // Arrange
    const fullGreen = '#00FF00'
    const fullBlue = '#0000FF'

    // Act
    const overGreen = readableInk(fullGreen)
    const overBlue = readableInk(fullBlue)

    // Assert
    expect(overGreen).toBe(DARK_INK)
    expect(overBlue).toBe(WHITE_INK)
  })

  it('accepts a hex written without the leading hash', () => {
    // Arrange / Act
    const ink = readableInk('1A1A2E')

    // Assert
    expect(ink).toBe(WHITE_INK)
  })

  it('keeps the extremes on the expected side', () => {
    // Arrange / Act
    const overWhite = readableInk('#FFFFFF')
    const overBlack = readableInk('#000000')

    // Assert
    expect(overWhite).toBe(DARK_INK)
    expect(overBlack).toBe(WHITE_INK)
  })
})
