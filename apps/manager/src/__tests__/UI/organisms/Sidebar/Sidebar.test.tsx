import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { TenantRole } from '@custom_types/auth/tenant-role'
import { useQueueSummary } from '@hooks/order/useQueueSummary'
import { useTenantRole } from '@hooks/session/useTenantRole'
import { useSessionStore } from '@states/useSessionStore'

import { Sidebar } from '@organisms/Sidebar/Sidebar'

vi.mock('@organisms/StoreSwitcher/StoreSwitcher', () => ({
  StoreSwitcher: () => null,
}))
vi.mock('@organisms/UserMenu/UserMenu', () => ({
  UserMenu: () => null,
}))
vi.mock('@hooks/order/useQueueSummary')
vi.mock('@hooks/session/useTenantRole')
vi.mock('@states/useSessionStore')

const mockRole = (role: TenantRole | null) =>
  vi.mocked(useTenantRole).mockReturnValue(role)

const mockWaiting = (pending: number) =>
  vi.mocked(useQueueSummary).mockReturnValue({
    data: { PENDING: pending },
  } as unknown as ReturnType<typeof useQueueSummary>)

const renderSidebar = (
  overrides: Partial<{ isOpen: boolean; collapsed: boolean }> = {}
) =>
  render(
    <MemoryRouter>
      <Sidebar
        tenantId="tenant-1"
        isOpen={overrides.isOpen ?? false}
        onClose={vi.fn()}
        collapsed={overrides.collapsed ?? false}
        onToggleCollapse={vi.fn()}
      />
    </MemoryRouter>
  )

describe(Sidebar.name, () => {
  it('renders the sections a manager can see', () => {
    // Arrange
    mockRole('TENANT_OWNER')
    mockWaiting(0)
    vi.mocked(useSessionStore).mockImplementation((selector) =>
      selector({ user: { name: 'Ana' } } as never)
    )

    // Act
    renderSidebar()

    // Assert
    expect(screen.getByText('Configurações')).toBeInTheDocument()
  })

  it('hides manager-only sections for staff', () => {
    // Arrange
    mockRole('STAFF')
    mockWaiting(0)
    vi.mocked(useSessionStore).mockImplementation((selector) =>
      selector({ user: { name: 'Ana' } } as never)
    )

    // Act
    renderSidebar()

    // Assert
    expect(screen.queryByText('Configurações')).not.toBeInTheDocument()
    expect(screen.getByText('Balcão')).toBeInTheDocument()
  })

  it('calls onToggleCollapse when the collapse button is clicked', async () => {
    // Arrange
    mockRole('TENANT_OWNER')
    mockWaiting(0)
    vi.mocked(useSessionStore).mockImplementation((selector) =>
      selector({ user: { name: 'Ana' } } as never)
    )
    const onToggleCollapse = vi.fn()

    // Act
    render(
      <MemoryRouter>
        <Sidebar
          tenantId="tenant-1"
          isOpen={false}
          onClose={vi.fn()}
          collapsed={false}
          onToggleCollapse={onToggleCollapse}
        />
      </MemoryRouter>
    )
    await userEvent.click(screen.getByRole('button', { name: 'Recolher menu' }))

    // Assert
    expect(onToggleCollapse).toHaveBeenCalled()
  })
})
