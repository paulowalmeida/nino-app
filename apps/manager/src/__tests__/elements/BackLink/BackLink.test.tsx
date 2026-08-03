import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BackLink } from '@elements/BackLink/BackLink'

describe(BackLink.name, () => {
  it('renders the children text as the link content', () => {
    // Arrange
    render(
      <MemoryRouter>
        <BackLink>Voltar</BackLink>
      </MemoryRouter>
    )

    // Act
    const link = screen.getByRole('link', { name: 'Voltar' })

    // Assert
    expect(link).toBeInTheDocument()
  })

  it('defaults to going up one level when `to` is not provided', () => {
    // Arrange
    render(
      <MemoryRouter initialEntries={['/orders/1']}>
        <Routes>
          <Route path="orders/:id" element={<BackLink>Voltar</BackLink>} />
        </Routes>
      </MemoryRouter>
    )

    // Act
    const link = screen.getByRole('link', { name: 'Voltar' })

    // Assert
    expect(link).toHaveAttribute('href', '/orders')
  })

  it('navigates to the given relative `to` when provided', () => {
    // Arrange
    render(
      <MemoryRouter initialEntries={['/orders/1']}>
        <Routes>
          <Route
            path="orders/:id"
            element={<BackLink to="../history">Voltar</BackLink>}
          />
        </Routes>
      </MemoryRouter>
    )

    // Act
    const link = screen.getByRole('link', { name: 'Voltar' })

    // Assert
    expect(link).toHaveAttribute('href', '/orders/history')
  })
})
