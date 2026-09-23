import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Sidebar } from './Sidebar'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit', () => ({
  useCurrentUnit: () => ({ unitId: 'unit-1' }),
}))
vi.mock('@shared/hooks/order/useQueueSummary/useQueueSummary', () => ({
  useQueueSummary: () => ({ data: { PENDING: 2 } }),
}))
vi.mock('@layouts/AppLayout/hooks/useSidemenu/useSidemenu', () => ({
  useSidemenu: () => ({ groups: [] }),
}))
vi.mock('@shared/states/session/session.state', () => ({
  useSessionStore: () => ({ name: 'Marina Silva' }),
}))
vi.mock('./SidebarNavigation/SidebarNavigation', () => ({
  SidebarNavigation: () => <nav />,
}))
vi.mock('./StoreSwitcher/StoreSwitcher', () => ({ StoreSwitcher: () => null }))
vi.mock('./UserMenu/UserMenu', () => ({ UserMenu: () => null }))

describe('Sidebar', () => {
  it('renders the sidebar landmark', () => {
    render(
      <MemoryRouter>
        <Sidebar
          isOpen={false}
          onClose={() => undefined}
          collapsed={false}
          onToggleCollapse={() => undefined}
          onOpenCommandPalette={() => undefined}
        />
      </MemoryRouter>
    )
    expect(screen.getByRole('complementary')).toBeInTheDocument()
  })

  it('keeps the expand control available when collapsed', () => {
    render(
      <MemoryRouter>
        <Sidebar
          isOpen={false}
          onClose={() => undefined}
          collapsed
          onToggleCollapse={() => undefined}
          onOpenCommandPalette={() => undefined}
        />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('button', { name: 'Expandir menu' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Ir para a visão geral' })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Buscar funcionalidade' })
    ).toBeInTheDocument()
  })
})
