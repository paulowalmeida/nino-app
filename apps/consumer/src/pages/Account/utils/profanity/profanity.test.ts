import { describe, expect, it } from 'vitest'

import { hasProfanity } from './profanity'
import { profanityMock } from './profanity.mock'

describe('hasProfanity', () => {
  it('accepts a clean name', () => {
    // Arrange
    // Act
    const result = hasProfanity(profanityMock.cleanName)

    // Assert
    expect(result).toBe(false)
  })

  it('rejects an exact offensive word', () => {
    // Arrange
    const term = atob(profanityMock.exactTermB64)

    // Act
    const result = hasProfanity(term)

    // Assert
    expect(result).toBe(true)
  })

  it('rejects a leetspeak-obfuscated offensive term', () => {
    // Arrange
    const term = atob(profanityMock.leetSubstringTermB64)

    // Act
    const result = hasProfanity(term)

    // Assert
    expect(result).toBe(true)
  })

  it('treats an empty string as clean', () => {
    // Arrange
    // Act
    const result = hasProfanity('')

    // Assert
    expect(result).toBe(false)
  })
})
