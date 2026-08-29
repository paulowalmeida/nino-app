import { describe, expect, it } from 'vitest'

import { greeting } from './greeting'
import { greetingMock } from './greeting.mock'

describe('greeting', () => {
  it('greets good morning before noon', () => {
    // Arrange
    // Act
    const result = greeting(greetingMock.morning)

    // Assert
    expect(result).toBe('Bom dia')
  })

  it('greets good afternoon between noon and 6pm', () => {
    // Arrange
    // Act
    const result = greeting(greetingMock.afternoon)

    // Assert
    expect(result).toBe('Boa tarde')
  })

  it('greets good evening after 6pm', () => {
    // Arrange
    // Act
    const result = greeting(greetingMock.night)

    // Assert
    expect(result).toBe('Boa noite')
  })
})
