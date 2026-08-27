import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SidebarNavLink } from './SidebarNavLink'

describe('SidebarNavLink', () => {
  it('renders the destination label', () => {
    render(
      <MemoryRouter>
        <SidebarNavLink
          tenantId="tenant-1"
          section="pedidos"
          label="Pedidos"
          icon="receipt"
          isCollapsed={false}
          waiting={2}
          delay={{}}
          onNavigate={() => undefined}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Pedidos')).toBeInTheDocument()
  })
})
