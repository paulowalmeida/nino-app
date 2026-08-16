import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SidebarNavLink } from '@molecules/SidebarNavLink/SidebarNavLink'

describe(SidebarNavLink.name, () => {
  it('links to the tenant section', () => {
    // Arrange / Act
    render(
      <MemoryRouter>
        <SidebarNavLink
          tenantId="tenant-1"
          section="visao-geral"
          label="Visão geral"
          icon="store"
          isCollapsed={false}
          waiting={0}
          delay={{}}
          onNavigate={vi.fn()}
        />
      </MemoryRouter>
    )

    // Assert
    const link = screen.getByRole('link', { name: 'Visão geral' })
    expect(link).toHaveAttribute('href', '/tenant-1/visao-geral')
  })

  it('shows the waiting tally for the pedidos section', () => {
    // Arrange / Act
    render(
      <MemoryRouter>
        <SidebarNavLink
          tenantId="tenant-1"
          section="pedidos"
          label="Pedidos"
          icon="bag"
          isCollapsed={false}
          waiting={3}
          delay={{}}
          onNavigate={vi.fn()}
        />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('never shows a tally outside the pedidos section', () => {
    // Arrange / Act
    render(
      <MemoryRouter>
        <SidebarNavLink
          tenantId="tenant-1"
          section="visao-geral"
          label="Visão geral"
          icon="store"
          isCollapsed={false}
          waiting={3}
          delay={{}}
          onNavigate={vi.fn()}
        />
      </MemoryRouter>
    )

    // Assert
    expect(screen.queryByText('3')).not.toBeInTheDocument()
  })
})
