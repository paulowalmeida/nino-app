import { render, screen } from '@testing-library/react'
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

  it('hides the Pedido tab with no tracked order', () => {
    // Arrange
    // Act
    render(
      <MemoryRouter>
        <TabBar base="/demo" />
      </MemoryRouter>
    )

    // Assert
    expect(
      screen.queryByRole('button', { name: 'Pedido' })
    ).not.toBeInTheDocument()
  })

  it('shows the Pedido tab for a guest order tracked on this device', () => {
    // Arrange
    guestOrdersState.orders = [guestOrderMock]

    // Act
    render(
      <MemoryRouter>
        <TabBar base="/demo" />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByRole('button', { name: 'Pedido' })).toBeInTheDocument()
  })

  it('shows the Pedido tab for a logged consumer active order', () => {
    // Arrange
    sessionState.consumer = consumerMock
    myOrdersState.data = [activeMyOrderMock]

    // Act
    render(
      <MemoryRouter>
        <TabBar base="/demo" />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByRole('button', { name: 'Pedido' })).toBeInTheDocument()
  })

  it('hides the Pedido tab for a logged consumer with no active order', () => {
    // Arrange
    sessionState.consumer = consumerMock
    myOrdersState.data = [deliveredMyOrderMock]

    // Act
    render(
      <MemoryRouter>
        <TabBar base="/demo" />
      </MemoryRouter>
    )

    // Assert
    expect(
      screen.queryByRole('button', { name: 'Pedido' })
    ).not.toBeInTheDocument()
  })
})
