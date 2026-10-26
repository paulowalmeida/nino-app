import { describe, expect, it } from 'vitest'

import { getPasswordStrength } from './passwordStrength'

describe(getPasswordStrength.name, () => {
  it('scores an empty password as zero and weak', () => {
    // Arrange / Act
    const { score, level } = getPasswordStrength('')

    // Assert
    expect(score).toBe(0)
    expect(level).toBe('weak')
  })

  it('stays weak while only one rule is satisfied', () => {
    // Arrange / Act
    const { score, level } = getPasswordStrength('abc')

    // Assert
    expect(score).toBe(1)
    expect(level).toBe('weak')
  })

  it('rewards the eighth character, turning weak into medium', () => {
    // Arrange
    const sevenChars = 'abcdefg'
    const eightChars = 'abcdefgh'

    // Act
    const shorter = getPasswordStrength(sevenChars)
    const longer = getPasswordStrength(eightChars)

    // Assert
    expect(shorter).toEqual({ score: 1, level: 'weak' })
    expect(longer).toEqual({ score: 2, level: 'medium' })
  })

  it('rewards the twelfth character on top of the eighth', () => {
    // Arrange / Act
    const { score } = getPasswordStrength('abcdefghijkl')

    // Assert
    expect(score).toBe(3)
  })

  it('counts each kind of character only once', () => {
    // Arrange / Act
    const { score } = getPasswordStrength('aaAA11!!')

    // Assert
    expect(score).toBe(5)
  })

  it('keeps four points inside medium, so strong means real variety', () => {
    // Arrange / Act
    const { score, level } = getPasswordStrength('Abcdefg1')

    // Assert
    expect(score).toBe(4)
    expect(level).toBe('medium')
  })

  it('reaches the maximum score with length and every kind mixed', () => {
    // Arrange / Act
    const { score, level } = getPasswordStrength('Abcdefghijk1!')

    // Assert
    expect(score).toBe(6)
    expect(level).toBe('strong')
  })

  it('treats an emoji as a symbol, not as an unknown character', () => {
    // Arrange / Act
    const { score } = getPasswordStrength('🙂')

    // Assert
    expect(score).toBe(1)
  })
})
