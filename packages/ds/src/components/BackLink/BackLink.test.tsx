import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { BackLink } from './BackLink'

describe(BackLink.name, () => {
  it('renders the children text as the link content', () => {
    // Arrange / Act
    render(<BackLink href="/orders">Voltar</BackLink>)

    // Assert
    expect(screen.getByRole('link', { name: 'Voltar' })).toBeInTheDocument()
  })

  it('sets the given href on the link', () => {
    // Arrange / Act
    render(<BackLink href="/orders">Voltar</BackLink>)

    // Assert
    expect(screen.getByRole('link', { name: 'Voltar' })).toHaveAttribute(
      'href',
      '/orders'
    )
  })

  it('calls onClick when clicked', () => {
    // Arrange
    const onClick = vi.fn()
    render(
      <BackLink href="/orders" onClick={onClick}>
        Voltar
      </BackLink>
    )

    // Act
    screen.getByRole('link', { name: 'Voltar' }).click()

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
