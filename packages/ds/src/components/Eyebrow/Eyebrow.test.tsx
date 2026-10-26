import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Eyebrow } from './Eyebrow'

describe(Eyebrow.name, () => {
  it('renders the children text', () => {
    // Arrange / Act
    render(<Eyebrow>Novidade</Eyebrow>)

    // Assert
    expect(screen.getByText('Novidade')).toBeInTheDocument()
  })

  it('does not include a custom class when none is given', () => {
    // Arrange / Act
    render(<Eyebrow>Novidade</Eyebrow>)

    // Assert
    expect(screen.getByText('Novidade')).not.toHaveClass('custom')
  })

  it('appends the given className to the base class', () => {
    // Arrange
    render(<Eyebrow className="custom">Novidade</Eyebrow>)

    // Act
    const eyebrow = screen.getByText('Novidade')

    // Assert
    expect(eyebrow).toHaveClass('custom')
  })
})
