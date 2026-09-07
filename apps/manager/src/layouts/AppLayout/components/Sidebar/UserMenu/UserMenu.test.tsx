import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useTenantRole } from '@layouts/AppLayout/hooks/useTenantRole/useTenantRole'

import { UserMenu } from './UserMenu'
import { managerRoleMock, ownerRoleMock, userMenuMock } from './UserMenu.mock'

vi.mock('@shared/hooks/session/useLogout/useLogout', () => ({
  useLogout: () => ({ logout: vi.fn() }),
}))
vi.mock('@layouts/AppLayout/hooks/useTenantRole/useTenantRole')

describe('UserMenu', () => {
  it('shows the signed-in user name', () => {
    vi.mocked(useTenantRole).mockReturnValue(managerRoleMock)

    render(
      <MemoryRouter>
        <UserMenu {...userMenuMock} />
      </MemoryRouter>
    )

    expect(screen.getByText('Marina')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Sair da conta' })
    ).toBeInTheDocument()
  })

  it('offers the plan to the owner of the tenant', async () => {
    vi.mocked(useTenantRole).mockReturnValue(ownerRoleMock)
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <UserMenu {...userMenuMock} />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: /Marina/ }))

    expect(
      await screen.findByRole('menuitem', { name: /Assinatura/ })
    ).toBeInTheDocument()
  })

  it('keeps the plan with whoever pays for it', async () => {
    vi.mocked(useTenantRole).mockReturnValue(managerRoleMock)
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <UserMenu {...userMenuMock} />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: /Marina/ }))

    expect(
      screen.queryByRole('menuitem', { name: /Assinatura/ })
    ).not.toBeInTheDocument()
  })

  it('names the sign-out button on hover', async () => {
    vi.mocked(useTenantRole).mockReturnValue(managerRoleMock)
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <UserMenu {...userMenuMock} />
      </MemoryRouter>
    )

    await user.hover(screen.getByRole('button', { name: 'Sair da conta' }))

    expect(await screen.findByText('Sair')).toBeInTheDocument()
  })
})
