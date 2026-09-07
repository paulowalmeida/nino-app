import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Sidebar } from './Sidebar'

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant', () => ({
  useCurrentTenant: () => ({ tenantId: 'tenant-1' }),
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
vi.mock('@shared/hooks/session/useCompanyGroups/useCompanyGroups', () => ({
  useCompanyGroups: () => [
    {
      companyId: 'company-1',
      companyName: 'Burgão do Nino',
      units: [
        { tenantId: 'tenant-1', tenantName: 'Centro' },
        { tenantId: 'tenant-2', tenantName: 'Pinheiros' },
      ],
    },
  ],
}))
vi.mock('./SidebarNavigation/SidebarNavigation', () => ({
  SidebarNavigation: () => <nav />,
}))
vi.mock('./UserMenu/UserMenu', () => ({ UserMenu: () => null }))

describe('Sidebar closing the drawer', () => {
  it('takes the store switcher dropdown down with it', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <MemoryRouter initialEntries={['/tenant-1/pedidos']}>
        <Sidebar
          isOpen
          onClose={() => undefined}
          collapsed={false}
          onToggleCollapse={() => undefined}
        />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: /Centro/ }))
    expect(await screen.findByText('Pinheiros')).toBeInTheDocument()

    rerender(
      <MemoryRouter initialEntries={['/tenant-1/pedidos']}>
        <Sidebar
          isOpen={false}
          onClose={() => undefined}
          collapsed={false}
          onToggleCollapse={() => undefined}
        />
      </MemoryRouter>
    )

    expect(screen.queryByText('Pinheiros')).not.toBeInTheDocument()
  })
})
