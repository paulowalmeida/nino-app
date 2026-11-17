import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TabBar } from './TabBar'
import {
  activeMyOrderMock,
  consumerMock,
  deliveredMyOrderMock,
  guestOrderMock,
} from './TabBar.mock'

const sessionState = vi.hoisted(() => ({
  consumer: null as unknown,
}))

const guestOrdersState = vi.hoisted(() => ({
  orders: [] as unknown[],
}))

const myOrdersState = vi.hoisted(() => ({
  data: undefined as unknown,
}))

vi.mock('@shared/hooks/useConsumerSession/useConsumerSession', () => ({
  useConsumerSession: () => ({
    consumer: sessionState.consumer,
    isPending: false,
  }),
}))

vi.mock('@shared/hooks/useGuestOrders/useGuestOrders', () => ({
  useGuestOrders: () => guestOrdersState.orders,
}))

vi.mock('@shared/hooks/useMyOrders/useMyOrders', () => ({
  useMyOrders: () => ({ data: myOrdersState.data, isPending: false }),
}))

vi.mock('@shared/hooks/useStoreTint/useStoreTint', () => ({
  useStoreTint: () => undefined,
}))

vi.mock('@shared/hooks/useLogout/useLogout', () => ({
  useLogout: () => ({ mutate: vi.fn(), isPending: false }),
}))

describe('TabBar', () => {
  beforeEach(() => {
    sessionState.consumer = null
    guestOrdersState.orders = []
    myOrdersState.data = undefined
  })

  it('shows the Busca tab only when a search handler is given', () => {
    const onOpenSearch = vi.fn()
    const { rerender } = render(
      <MemoryRouter>
        <TabBar base="/demo" />
      </MemoryRouter>
    )

    expect(screen.queryByText('Busca')).not.toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <TabBar base="/demo" onOpenSearch={onOpenSearch} />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByLabelText('Buscar no cardápio'))

    expect(onOpenSearch).toHaveBeenCalledTimes(1)
  })

  it('exposes one accessible cart entry when the storefront provides it', () => {
    render(
      <MemoryRouter>
        <TabBar base="/demo" onOpenCart={vi.fn()} />
      </MemoryRouter>
    )

    expect(
      screen.getAllByRole('button', { name: 'Sacola vazia' })
    ).toHaveLength(1)
  })

  it('keeps a plain Mais tab with no tracked order', () => {
    render(
      <MemoryRouter>
        <TabBar base="/demo" />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('button', { name: 'Mais opções' })
    ).toBeInTheDocument()
  })

  it('flags the Mais tab for a guest order tracked on this device', () => {
    guestOrdersState.orders = [guestOrderMock]

    render(
      <MemoryRouter>
        <TabBar base="/demo" />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('button', {
        name: 'Mais opções — pedido em andamento',
      })
    ).toBeInTheDocument()
  })

  it('flags the Mais tab only for an active order of a logged consumer', () => {
    sessionState.consumer = consumerMock
    myOrdersState.data = [deliveredMyOrderMock]

    const { rerender } = render(
      <MemoryRouter>
        <TabBar base="/demo" />
      </MemoryRouter>
    )
    expect(
      screen.getByRole('button', { name: 'Mais opções' })
    ).toBeInTheDocument()

    myOrdersState.data = [activeMyOrderMock]
    rerender(
      <MemoryRouter>
        <TabBar base="/demo" />
      </MemoryRouter>
    )
    expect(
      screen.getByRole('button', {
        name: 'Mais opções — pedido em andamento',
      })
    ).toBeInTheDocument()
  })

  it('lists coupons, notices and profile under Mais', async () => {
    render(
      <MemoryRouter>
        <TabBar base="/demo" onOpenCoupons={vi.fn()} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Mais opções' }))

    expect(
      await screen.findByRole('menuitem', { name: 'Cupons' })
    ).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Avisos' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Perfil' })).toBeInTheDocument()
  })
})
