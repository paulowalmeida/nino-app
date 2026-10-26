import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { footerNavPropsMock } from './FooterNav.mock'

import { FooterNav } from './FooterNav'

vi.mock('@shared/components/PoweredBy/PoweredBy', () => ({
  PoweredBy: () => <p>Marca nino</p>,
}))
vi.mock('@shared/components/TabBar/TabBar/TabBar', () => ({
  TabBar: () => <nav aria-label="Atalhos" />,
}))

describe('FooterNav', () => {
  it('renders the branding mark alongside the bottom navigation', () => {
    // Arrange + Act
    render(
      <MemoryRouter>
        <FooterNav {...footerNavPropsMock} />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText('Marca nino')).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: 'Atalhos' })
    ).toBeInTheDocument()
  })
})
