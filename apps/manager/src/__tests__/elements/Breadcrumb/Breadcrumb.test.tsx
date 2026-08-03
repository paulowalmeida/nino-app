import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Breadcrumb } from '@elements/Breadcrumb/Breadcrumb'

describe(Breadcrumb.name, () => {
  it('renders every step of the trail as text', () => {
    // Arrange
    const trail = [
      { label: 'Clientes', to: '..' },
      { label: 'Ana Souza' },
    ]

    // Act
    render(
      <MemoryRouter>
        <Breadcrumb trail={trail} />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText('Clientes')).toBeInTheDocument()
    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
  })

  it('renders a step without `to` as the current page, not a link', () => {
    // Arrange
    const trail = [{ label: 'Clientes', to: '..' }, { label: 'Ana Souza' }]

    // Act
    render(
      <MemoryRouter>
        <Breadcrumb trail={trail} />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText('Ana Souza')).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(screen.queryByRole('link', { name: 'Ana Souza' })).toBeNull()
  })

  it('renders a single-item trail without a divider', () => {
    // Arrange
    const trail = [{ label: 'Clientes' }]

    // Act
    const { container } = render(
      <MemoryRouter>
        <Breadcrumb trail={trail} />
      </MemoryRouter>
    )

    // Assert
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull()
  })

  it('renders no items for an empty trail', () => {
    // Arrange
    render(
      <MemoryRouter>
        <Breadcrumb trail={[]} />
      </MemoryRouter>
    )

    // Act
    const nav = screen.getByRole('navigation', { name: 'Você está em' })

    // Assert
    expect(nav.querySelectorAll('li')).toHaveLength(0)
  })
})
