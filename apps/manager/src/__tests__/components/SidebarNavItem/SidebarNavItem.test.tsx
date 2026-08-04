import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { NavItem } from '@custom_types/ui/nav-item'
import { SidebarNavItem } from '@components/SidebarNavItem/SidebarNavItem'

const leafItem: NavItem = {
  section: 'visao-geral',
  label: 'Visão geral',
  icon: 'store',
}

const parentItem: NavItem = {
  section: 'configuracoes',
  label: 'Configurações',
  icon: 'settings',
  children: [{ to: 'empresa', label: 'Empresa', icon: 'building' }],
}

const renderItem = (item: NavItem, overrides: Partial<{
  isCollapsed: boolean
  isInside: boolean
  isOpen: boolean
  waiting: number
}> = {}) =>
  render(
    <MemoryRouter>
      <SidebarNavItem
        tenantId="tenant-1"
        item={item}
        isCollapsed={overrides.isCollapsed ?? false}
        isInside={overrides.isInside ?? false}
        isOpen={overrides.isOpen ?? false}
        onOpenChange={vi.fn()}
        delay={{}}
        waiting={overrides.waiting ?? 0}
        onNavigate={vi.fn()}
      />
    </MemoryRouter>
  )

describe(SidebarNavItem.name, () => {
  it('renders a plain link to the section for an item with no children', () => {
    // Arrange / Act
    renderItem(leafItem)

    // Assert
    const link = screen.getByRole('link', { name: 'Visão geral' })
    expect(link).toHaveAttribute('href', '/tenant-1/visao-geral')
  })

  it('hides the label when collapsed', () => {
    // Arrange / Act
    renderItem(leafItem, { isCollapsed: true })

    // Assert
    expect(screen.queryByText('Visão geral')).not.toBeInTheDocument()
  })

  it('shows the waiting badge for pedidos when the count is positive', () => {
    // Arrange / Act
    renderItem(
      { section: 'pedidos', label: 'Pedidos', icon: 'store' },
      { waiting: 3 }
    )

    // Assert
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not show a waiting badge when the count is zero', () => {
    // Arrange / Act
    renderItem(
      { section: 'pedidos', label: 'Pedidos', icon: 'store' },
      { waiting: 0 }
    )

    // Assert
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('renders an accordion trigger and its child links', () => {
    // Arrange / Act
    renderItem(parentItem, { isOpen: true })

    // Assert
    expect(
      screen.getByRole('button', { name: 'Configurações' })
    ).toBeInTheDocument()
    const childLink = screen.getByRole('link', { name: 'Empresa' })
    expect(childLink).toHaveAttribute('href', '/tenant-1/configuracoes/empresa')
  })
})
