import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { NinoLogo } from '@elements/NinoLogo/NinoLogo'

describe(NinoLogo.name, () => {
  it('renders as static content when `to` is not provided', () => {
    // Arrange
    render(
      <MemoryRouter>
        <NinoLogo />
      </MemoryRouter>
    )

    // Act
    const link = screen.queryByRole('link')

    // Assert
    expect(link).not.toBeInTheDocument()
  })

  it('renders as a link resolving `to` when it is provided', () => {
    // Arrange
    render(
      <MemoryRouter initialEntries={['/tenant-1']}>
        <NinoLogo to="/tenant-1/visao-geral" />
      </MemoryRouter>
    )

    // Act
    const link = screen.getByRole('link')

    // Assert
    expect(link).toHaveAttribute('href', '/tenant-1/visao-geral')
  })

  it('shows the app label next to the wordmark', () => {
    // Arrange
    render(
      <MemoryRouter>
        <NinoLogo />
      </MemoryRouter>
    )

    // Act
    const label = screen.getByText('GESTOR')

    // Assert
    expect(label).toBeInTheDocument()
  })

  it('hides the wordmark when `hideWordmark` is true', () => {
    // Arrange
    render(
      <MemoryRouter>
        <NinoLogo hideWordmark />
      </MemoryRouter>
    )

    // Act
    const wordmark = screen.queryByText('nino')

    // Assert
    expect(wordmark).not.toBeInTheDocument()
  })
})
