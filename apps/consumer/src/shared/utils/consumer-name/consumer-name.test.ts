import { describe, expect, it } from 'vitest'

import { consumerInitials, firstName } from './consumer-name'
import { consumerNameMock } from './consumer-name.mock'

describe('firstName', () => {
  it('returns the first word of the full name', () => {
    // Arrange
    // Act
    const result = firstName(consumerNameMock.fullName)

    // Assert
    expect(result).toBe('Maria')
  })

  it('returns null when there is no name yet', () => {
    // Arrange
    // Act
    const result = firstName(null)

    // Assert
    expect(result).toBeNull()
  })
})

describe('consumerInitials', () => {
  it('joins the first letter of the first and last name', () => {
    // Arrange
    // Act
    const result = consumerInitials(consumerNameMock.fullName)

    // Assert
    expect(result).toBe('MS')
  })

  it('uses a single letter when there is only one name', () => {
    // Arrange
    // Act
    const result = consumerInitials(consumerNameMock.singleName)

    // Assert
    expect(result).toBe('M')
  })

  it('returns null when there is no name yet', () => {
    // Arrange
    // Act
    const result = consumerInitials(null)

    // Assert
    expect(result).toBeNull()
  })
})
