import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SidebarNavGroup } from '@molecules/SidebarNavGroup/SidebarNavGroup'

describe(SidebarNavGroup.name, () => {
  it('renders the trigger and its child links', () => {
    // Arrange / Act
    render(
      <MemoryRouter>
        <SidebarNavGroup
          tenantId="tenant-1"
          section="configuracoes"
          label="Configurações"
          icon="settings"
          items={[{ to: 'empresa', label: 'Empresa', icon: 'building' }]}
          isCollapsed={false}
          isInside={false}
          isOpen
          onOpenChange={vi.fn()}
          delay={{}}
          onNavigate={vi.fn()}
        />
      </MemoryRouter>
    )

    // Assert
    expect(
      screen.getByRole('button', { name: 'Configurações' })
    ).toBeInTheDocument()
    const childLink = screen.getByRole('link', { name: 'Empresa' })
    expect(childLink).toHaveAttribute(
      'href',
      '/tenant-1/configuracoes/empresa'
    )
  })

  it('collapses the child links when closed', () => {
    // Arrange / Act
    render(
      <MemoryRouter>
        <SidebarNavGroup
          tenantId="tenant-1"
          section="configuracoes"
          label="Configurações"
          icon="settings"
          items={[{ to: 'empresa', label: 'Empresa', icon: 'building' }]}
          isCollapsed={false}
          isInside={false}
          isOpen={false}
          onOpenChange={vi.fn()}
          delay={{}}
          onNavigate={vi.fn()}
        />
      </MemoryRouter>
    )

    // Assert
    expect(
      screen.queryByRole('link', { name: 'Empresa' })
    ).not.toBeInTheDocument()
  })
})
