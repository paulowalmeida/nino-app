import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AuthLayout } from '@layouts/AuthLayout/AuthLayout'

const renderLayout = () =>
  render(
    <MemoryRouter initialEntries={['/entrar']}>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route path="entrar" element={<div>Formulário</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )

describe(AuthLayout.name, () => {
  it('renders the routed auth form through the outlet', () => {
    // Arrange / Act
    renderLayout()

    // Assert
    expect(screen.getByText('Formulário')).toBeInTheDocument()
  })

  it('shows the brand tagline', () => {
    // Arrange / Act
    renderLayout()

    // Assert
    expect(screen.getByText('do seu jeito.')).toBeInTheDocument()
  })

  it('hides the decorative glow and halo from assistive tech', () => {
    // Arrange / Act
    const { container } = renderLayout()

    // Assert
    const decorative = container.querySelectorAll('[aria-hidden="true"]')
    expect(decorative.length).toBeGreaterThanOrEqual(3)
  })
})
