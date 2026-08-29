import { describe, expect, it } from 'vitest'

import { customerInitials, firstName } from './customer-name'
import { customerNameMock } from './customer-name.mock'

describe('firstName', () => {
  it('returns the first word of the full name', () => {
    // Arrange
    // Act
    const result = firstName(customerNameMock.fullName)

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

describe('customerInitials', () => {
  it('joins the first letter of the first and last name', () => {
    // Arrange
    // Act
    const result = customerInitials(customerNameMock.fullName)

    // Assert
    expect(result).toBe('MS')
  })

  it('uses a single letter when there is only one name', () => {
    // Arrange
    // Act
    const result = customerInitials(customerNameMock.singleName)

    // Assert
    expect(result).toBe('M')
  })

  it('returns null when there is no name yet', () => {
    // Arrange
    // Act
    const result = customerInitials(null)

    // Assert
    expect(result).toBeNull()
  })
})
