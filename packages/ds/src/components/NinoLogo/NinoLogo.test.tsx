import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { NinoLogo } from './NinoLogo'

describe(NinoLogo.name, () => {
  it('renders as static content when `href` is not provided', () => {
    // Arrange / Act
    render(<NinoLogo />)

    // Assert
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders as a link to `href` when it is provided', () => {
    // Arrange / Act
    render(<NinoLogo href="/unit-1/visao-geral" ariaLabel="Overview" />)

    // Assert
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/unit-1/visao-geral'
    )
  })

  it('calls onClick when the link is clicked', () => {
    // Arrange
    const onClick = vi.fn()
    render(<NinoLogo href="/x" ariaLabel="Overview" onClick={onClick} />)

    // Act
    screen.getByRole('link').click()

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('shows the wordmark by default', () => {
    // Arrange / Act
    render(<NinoLogo />)

    // Assert
    expect(screen.getByText('nino')).toBeInTheDocument()
  })

  it('hides the wordmark when `hideWordmark` is true', () => {
    // Arrange / Act
    render(<NinoLogo hideWordmark />)

    // Assert
    expect(screen.queryByText('nino')).not.toBeInTheDocument()
  })

  it('does not render a label by default', () => {
    // Arrange / Act
    render(<NinoLogo />)

    // Assert
    expect(screen.queryByText('GESTOR')).not.toBeInTheDocument()
  })

  it('renders the given label', () => {
    // Arrange / Act
    render(<NinoLogo label="GESTOR" />)

    // Assert
    expect(screen.getByText('GESTOR')).toBeInTheDocument()
  })

  it('renders the fallback "n" letter for the small size', () => {
    // Arrange / Act
    render(<NinoLogo size="sm" />)

    // Assert
    expect(screen.getByText('n')).toBeInTheDocument()
  })

  it('renders the fallback "n" letter for the medium size', () => {
    // Arrange / Act
    render(<NinoLogo size="md" />)

    // Assert
    expect(screen.getByText('n')).toBeInTheDocument()
  })

  it('renders the fallback "n" letter for the large size', () => {
    // Arrange / Act
    render(<NinoLogo size="lg" />)

    // Assert
    expect(screen.getByText('n')).toBeInTheDocument()
  })
})
