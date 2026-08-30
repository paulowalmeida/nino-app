import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { useCustomerSession } from '@shared/hooks/useCustomerSession/useCustomerSession'
import { useLogout } from '@shared/hooks/useLogout/useLogout'
import { useStoreTint } from '@shared/hooks/useStoreTint/useStoreTint'
import { AccountDrawer } from './AccountDrawer'
import { accountDrawerMock } from './AccountDrawer.mock'

vi.mock('@shared/hooks/useCustomerSession/useCustomerSession')
vi.mock('@shared/hooks/useLogout/useLogout')
vi.mock('@shared/hooks/useStoreTint/useStoreTint')

const renderDrawer = () =>
  render(
    <MemoryRouter initialEntries={['/loja']}>
      <AccountDrawer open onOpenChange={vi.fn()} base="/loja" />
    </MemoryRouter>
  )

describe('AccountDrawer', () => {
  it('shows account destinations without querying domain collections', () => {
    vi.mocked(useCustomerSession).mockReturnValue({
      customer: accountDrawerMock.customer,
    } as never)
    vi.mocked(useLogout).mockReturnValue({ mutate: vi.fn() } as never)
    vi.mocked(useStoreTint).mockReturnValue('#123456')

    renderDrawer()

    expect(screen.getByText('Dados pessoais')).toBeInTheDocument()
    expect(screen.getByText('Pedidos')).toBeInTheDocument()
    expect(screen.getByText('Endereços')).toBeInTheDocument()
  })

  it('offers sign-in instead of private destinations to a visitor', () => {
    vi.mocked(useCustomerSession).mockReturnValue({ customer: null } as never)
    vi.mocked(useLogout).mockReturnValue({ mutate: vi.fn() } as never)
    vi.mocked(useStoreTint).mockReturnValue(undefined)

    renderDrawer()

    expect(screen.getByText(/Entre para acompanhar seus pedidos/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })
})
