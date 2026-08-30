import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { useAccountLayoutFacade } from './facades/useAccountLayoutFacade/useAccountLayoutFacade'
import { useAccountLayoutFacadeMock } from './facades/useAccountLayoutFacade/useAccountLayoutFacade.mock'

import { AccountLayout } from './AccountLayout'

vi.mock('./facades/useAccountLayoutFacade/useAccountLayoutFacade')
vi.mock('./components/AccountHeader/AccountHeader', () => ({
  AccountHeader: () => <p>Header da conta</p>,
}))
vi.mock('./components/AccountNav/AccountNav', () => ({
  AccountNav: () => <p>Navegação da conta</p>,
}))
vi.mock('@shared/components/PoweredBy/PoweredBy', () => ({
  PoweredBy: () => null,
}))
vi.mock('@shared/components/TabBar/TabBar/TabBar', () => ({
  TabBar: () => null,
}))

const renderLayout = (path = '/conta') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<AccountLayout />}>
          <Route path="/conta" element={<p>Área privada</p>} />
        </Route>
        <Route path="/entrar" element={<p>Tela de entrada</p>} />
      </Routes>
    </MemoryRouter>
  )

describe('AccountLayout', () => {
  it('renders the account navigation and its route outlet', () => {
    vi.mocked(useAccountLayoutFacade).mockReturnValue({
      customer: useAccountLayoutFacadeMock.customer,
    } as never)

    renderLayout()

    expect(screen.getByText('Área privada')).toBeInTheDocument()
    expect(screen.getByText('Header da conta')).toBeInTheDocument()
    expect(screen.getByText('Navegação da conta')).toBeInTheDocument()
  })
})
