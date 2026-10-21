import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useUnitRole } from '@layouts/AppLayout/hooks/useUnitRole/useUnitRole'

import { UserMenu } from './UserMenu'
import { managerRoleMock, ownerRoleMock, userMenuMock } from './UserMenu.mock'

const logout = vi.fn()

vi.mock('@shared/hooks/session/useLogout/useLogout', () => ({
  useLogout: () => ({ logout }),
}))
vi.mock('@layouts/AppLayout/hooks/useUnitRole/useUnitRole')

const openMenu = async (role = managerRoleMock) => {
  vi.mocked(useUnitRole).mockReturnValue(role)
  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <UserMenu {...userMenuMock} />
    </MemoryRouter>
  )

  await user.click(screen.getByRole('button', { name: 'Abrir menu da conta' }))
  return user
}

describe('UserMenu', () => {
  it('identifies who is signed in and where', async () => {
    await openMenu()

    expect(await screen.findByText('Marina Silva')).toBeInTheDocument()
    expect(screen.getByText('marina@nino.delivery')).toBeInTheDocument()
    expect(screen.getByText('Gerente · Loja Centro')).toBeInTheDocument()
  })

  it('reaches the notifications screen', async () => {
    await openMenu()

    expect(
      await screen.findByRole('menuitem', { name: /Notificações/ })
    ).toBeInTheDocument()
  })

  it('offers the plan to the owner of the unit', async () => {
    await openMenu(ownerRoleMock)

    expect(
      await screen.findByRole('menuitem', { name: /Assinatura/ })
    ).toBeInTheDocument()
  })

  it('keeps the plan with whoever pays for it', async () => {
    await openMenu()

    await screen.findByRole('menuitem', { name: /Meu perfil/ })
    expect(
      screen.queryByRole('menuitem', { name: /Assinatura/ })
    ).not.toBeInTheDocument()
  })

  it('signs out last, without asking again', async () => {
    const user = await openMenu()

    const items = await screen.findAllByRole('menuitem')
    expect(items.at(-1)).toHaveTextContent('Sair')

    await user.click(items.at(-1)!)
    expect(logout).toHaveBeenCalledOnce()
  })
})
