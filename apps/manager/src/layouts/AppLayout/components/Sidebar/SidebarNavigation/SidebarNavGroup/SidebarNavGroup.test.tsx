import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SidebarNavGroup } from './SidebarNavGroup'

describe('SidebarNavGroup', () => {
  it('renders the group label', () => {
    render(
      <MemoryRouter>
        <SidebarNavGroup
          tenantId="tenant-1"
          section="catalogo"
          label="Catálogo"
          icon="grid"
          items={[]}
          isCollapsed={false}
          isInside={false}
          isOpen={false}
          onOpenChange={() => undefined}
          delay={{}}
          onNavigate={() => undefined}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Catálogo')).toBeInTheDocument()
  })
})
