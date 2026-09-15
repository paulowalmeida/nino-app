import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { SidebarNavLink } from './SidebarNavLink'

describe('SidebarNavLink', () => {
  it('renders the destination label', () => {
    render(
      <MemoryRouter>
        <SidebarNavLink
          unitId="unit-1"
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

  it('shows the destination label in a tooltip when collapsed', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <SidebarNavLink
          unitId="unit-1"
          section="pedidos"
          label="Pedidos"
          icon="receipt"
          isCollapsed
          waiting={0}
          delay={{}}
          onNavigate={() => undefined}
        />
      </MemoryRouter>
    )

    await user.hover(screen.getByRole('link', { name: 'Pedidos' }))

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Pedidos')
  })

  it('keeps Products inactive when Categories is the current route', () => {
    render(
      <MemoryRouter initialEntries={['/unit-1/categorias-produtos']}>
        <SidebarNavLink
          unitId="unit-1"
          section="produtos"
          label="Produtos"
          icon="book"
          isCollapsed={false}
          waiting={0}
          delay={{}}
          onNavigate={() => undefined}
        />
        <SidebarNavLink
          unitId="unit-1"
          section="categorias-produtos"
          label="Categorias"
          icon="tag"
          isCollapsed={false}
          waiting={0}
          delay={{}}
          onNavigate={() => undefined}
        />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Produtos' })).not.toHaveAttribute(
      'aria-current'
    )
    expect(screen.getByRole('link', { name: 'Categorias' })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })
})
