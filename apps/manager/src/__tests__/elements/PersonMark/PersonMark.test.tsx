import { PersonMark } from '@elements/PersonMark/PersonMark'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe(PersonMark.name, () => {
  it('renders the initials of a filled name', () => {
    // Arrange
    render(<PersonMark name="Paulo Silva" />)

    // Act
    const initials = screen.getByText('PS')

    // Assert
    expect(initials).toBeInTheDocument()
  })

  it('renders no initials text for an empty name', () => {
    // Arrange
    const { container } = render(<PersonMark name="" />)

    // Act
    const initials = container.textContent

    // Assert
    expect(initials).toBe('')
  })

  it('applies the brand tone class by default', () => {
    // Arrange
    const { container } = render(<PersonMark name="Paulo Silva" />)

    // Act
    const mark = container.firstElementChild

    // Assert
    expect(mark?.className).toMatch(/_brand_/)
  })

  it('applies the quiet tone class when tone is "quiet"', () => {
    // Arrange
    const { container } = render(<PersonMark name="Paulo Silva" tone="quiet" />)

    // Act
    const mark = container.firstElementChild

    // Assert
    expect(mark?.className).toMatch(/_quiet_/)
  })

  it('applies the night tone class when tone is "night"', () => {
    // Arrange
    const { container } = render(<PersonMark name="Paulo Silva" tone="night" />)

    // Act
    const mark = container.firstElementChild

    // Assert
    expect(mark?.className).toMatch(/_night_/)
  })
})
