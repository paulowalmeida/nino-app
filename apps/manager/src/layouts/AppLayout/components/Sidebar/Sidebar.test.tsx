import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Sidebar } from './Sidebar'

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant', () => ({
  useCurrentTenant: () => ({ tenantId: 'tenant-1' }),
}))
vi.mock('@shared/hooks/order/useQueueSummary/useQueueSummary', () => ({
  useQueueSummary: () => ({ data: { PENDING: 2 } }),
}))
const sidemenu = vi.hoisted(() => ({ setOpenSection: vi.fn() }))
vi.mock('@layouts/AppLayout/hooks/useSidemenu/useSidemenu', () => ({
  useSidemenu: () => ({
    groups: [],
    openSection: 'configuracoes',
    setOpenSection: sidemenu.setOpenSection,
    isInside: vi.fn(),
  }),
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
  beforeEach(() => sidemenu.setOpenSection.mockClear())

  it('renders the sidebar landmark', () => {
    render(
      <MemoryRouter>
        <Sidebar
          isOpen={false}
          onClose={() => undefined}
          collapsed={false}
          onToggleCollapse={() => undefined}
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
        />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('button', { name: 'Expandir menu' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Ir para a visão geral' })
    ).not.toBeInTheDocument()
  })

  it('closes the open section when the menu is collapsed', async () => {
    const onToggleCollapse = vi.fn()
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Sidebar
          isOpen={false}
          onClose={() => undefined}
          collapsed={false}
          onToggleCollapse={onToggleCollapse}
        />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: 'Recolher menu' }))

    expect(sidemenu.setOpenSection).toHaveBeenCalledWith(null)
    expect(onToggleCollapse).toHaveBeenCalled()
  })

  it('keeps the open section when the menu is expanded', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Sidebar
          isOpen={false}
          onClose={() => undefined}
          collapsed
          onToggleCollapse={() => undefined}
        />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: 'Expandir menu' }))

    expect(sidemenu.setOpenSection).not.toHaveBeenCalled()
  })
})
