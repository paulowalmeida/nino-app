import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router'

import { useOrdersFacade } from '@pages/Orders/facades/useOrdersFacade/useOrdersFacade'

import { AccountOrders } from './AccountOrders'
import { accountOrdersPageMock } from './AccountOrders.mock'

vi.mock('@pages/Orders/facades/useOrdersFacade/useOrdersFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useOrdersFacade).mockReturnValue({
    orders: [],
    isOrdersPending: false,
    ...overrides,
  } as unknown as ReturnType<typeof useOrdersFacade>)

const renderOrders = () =>
  render(
    <MemoryRouter initialEntries={['/loja/conta/pedidos']}>
      <Routes>
        <Route path="/:slug/conta/pedidos" element={<AccountOrders />} />
      </Routes>
    </MemoryRouter>
  )

describe('AccountOrders', () => {
  it('shows the loading state while orders are pending', () => {
    facadeWith({ isOrdersPending: true })

    renderOrders()

    expect(screen.getByLabelText('Carregando pedidos')).toBeInTheDocument()
  })

  it('shows the empty state when there are no orders', () => {
    facadeWith({ orders: [] })

    renderOrders()

    expect(
      screen.getByText(
        'Seus pedidos aparecem aqui assim que você fizer o primeiro.'
      )
    ).toBeInTheDocument()
  })

  it('shows the order list when orders are available', () => {
    facadeWith({ orders: accountOrdersPageMock.orders })

    renderOrders()

    expect(screen.getByText('Pedido entregue')).toBeInTheDocument()
  })
})
