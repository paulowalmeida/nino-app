import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { useCustomerSession } from '@shared/hooks/useCustomerSession/useCustomerSession'
import { AuthenticatedLayout } from './AuthenticatedLayout'
import { authenticatedLayoutMock } from './AuthenticatedLayout.mock'

vi.mock('@shared/hooks/useCustomerSession/useCustomerSession')

const SignIn = () => {
  const { state } = useLocation()

  return <p>Entrar para voltar a {state?.returnTo}</p>
}

const renderBoundary = (path = '/loja/conta/pedidos?status=aberto') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/:slug" element={<AuthenticatedLayout />}>
          <Route path="conta/pedidos" element={<p>Pedidos do cliente</p>} />
        </Route>
        <Route path="/:slug/entrar" element={<SignIn />} />
      </Routes>
    </MemoryRouter>
  )

describe('AuthenticatedLayout', () => {
  it('preserves the intended route when redirecting a visitor', () => {
    vi.mocked(useCustomerSession).mockReturnValue({
      customer: null,
      isPending: false,
    } as never)

    renderBoundary()

    expect(
      screen.getByText('Entrar para voltar a /loja/conta/pedidos?status=aberto')
    ).toBeInTheDocument()
  })

  it('renders the protected outlet for an authenticated customer', () => {
    vi.mocked(useCustomerSession).mockReturnValue({
      customer: authenticatedLayoutMock.customer,
      isPending: false,
    } as never)

    renderBoundary()

    expect(screen.getByText('Pedidos do cliente')).toBeInTheDocument()
  })

  it('renders a pending state while the session is unresolved', () => {
    vi.mocked(useCustomerSession).mockReturnValue({
      customer: null,
      isPending: true,
    } as never)

    renderBoundary()

    expect(screen.getByLabelText('Validando a sessão')).toHaveAttribute(
      'aria-busy',
      'true'
    )
  })
})
