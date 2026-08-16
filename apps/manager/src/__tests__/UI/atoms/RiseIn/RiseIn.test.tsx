import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RiseIn } from '@atoms/RiseIn/RiseIn'

describe(RiseIn.name, () => {
  it('renders what it wraps', () => {
    // Arrange / Act
    render(<RiseIn>conteúdo</RiseIn>)

    // Assert
    expect(screen.getByText('conteúdo')).toBeInTheDocument()
  })

  it('carries the delay the screen asked for', () => {
    // Arrange / Act
    const { container } = render(<RiseIn delay={240}>conteúdo</RiseIn>)

    // Assert
    expect(container.firstElementChild).toHaveStyle({ '--d': '240ms' })
  })

  it('starts without delay when the block opens the screen', () => {
    // Arrange / Act
    const { container } = render(<RiseIn>conteúdo</RiseIn>)

    // Assert
    expect(container.firstElementChild).toHaveStyle({ '--d': '0ms' })
  })

  it('renders the tag the screen needs for semantics', () => {
    // Arrange / Act
    const { container } = render(<RiseIn as="header">título</RiseIn>)

    // Assert
    expect(container.querySelector('header')).toBeInTheDocument()
  })

  it('keeps an extra className next to its own', () => {
    // Arrange / Act
    const { container } = render(<RiseIn className="extra">x</RiseIn>)

    // Assert
    expect(container.firstElementChild).toHaveClass('extra')
  })
})
