import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AccountChats } from './AccountChats'

const statusState = vi.hoisted(() => ({
  data: undefined as unknown,
  isPending: false,
  isError: false,
}))

const sessionState = vi.hoisted(() => ({
  consumer: null as unknown,
}))

const myOrdersState = vi.hoisted(() => ({
  data: undefined as unknown,
}))

const notificationsState = vi.hoisted(() => ({
  data: undefined as unknown,
  markRead: () => undefined,
}))

vi.mock('@hooks/useGuestOrderStatus/useGuestOrderStatus', () => ({
  useGuestOrderStatus: () => statusState,
}))

vi.mock('@shared/hooks/useConsumerSession/useConsumerSession', () => ({
  useConsumerSession: () => ({
    consumer: sessionState.consumer,
    isPending: false,
  }),
}))

vi.mock('@shared/hooks/useMyOrders/useMyOrders', () => ({
  useMyOrders: () => ({ data: myOrdersState.data, isPending: false }),
}))

vi.mock(
  '@shared/hooks/useConsumerNotifications/useConsumerNotifications',
  () => ({
    useConsumerNotifications: () => ({
      data: notificationsState.data,
      isPending: false,
      markRead: notificationsState.markRead,
    }),
  })
)

vi.mock('@hooks/useStoreTracking/useStoreTracking', () => ({
  useStoreTracking: () => ({
    stageLabel: (status: string) =>
      status === 'PREPARING'
        ? 'Sua comida está sendo preparada'
        : status === 'PENDING'
          ? 'Recebemos seu pedido'
          : status,
  }),
}))

describe('AccountChats', () => {
  beforeEach(() => {
    window.localStorage.clear()
    statusState.data = undefined
    statusState.isPending = false
    statusState.isError = false
    sessionState.consumer = null
    myOrdersState.data = undefined
    notificationsState.data = undefined
  })

  it('opens the public order screen without a previous order', () => {
    // Arrange
    // Act
    render(
      <MemoryRouter>
        <AccountChats />
      </MemoryRouter>
    )

    // Assert
    expect(
      screen.getByText('Nenhum pedido para acompanhar')
    ).toBeInTheDocument()
  })

  it('shows the active order and its updates', () => {
    window.localStorage.setItem(
      'nino.last-order',
      JSON.stringify({ orderId: 'order-1', token: 'token-1', slug: 'demo' })
    )
    statusState.data = {
      id: 'order-1',
      orderNumber: 136,
      status: 'PREPARING',
      channel: 'DELIVERY',
      estimatedDeliveryAt: null,
      createdAt: '2026-09-28T12:00:00.000Z',
      storeMessage: 'Seu pedido já entrou na fila da cozinha.',
      timeline: [
        { status: 'PENDING', at: '2026-09-28T12:01:00.000Z' },
        { status: 'PREPARING', at: '2026-09-28T12:05:00.000Z' },
      ],
    }

    render(
      <MemoryRouter initialEntries={['/demo/conta/conversas']}>
        <AccountChats />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: 'Atualizações do pedido' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'Sua comida está sendo preparada',
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Acompanhar pedido' })
    ).toHaveAttribute('href', '/pedido/order-1?token=token-1')
  })

  it('shows a completed order as history instead of an active notification', () => {
    window.localStorage.setItem(
      'nino.last-order',
      JSON.stringify({ orderId: 'order-1', token: 'token-1', slug: 'demo' })
    )
    statusState.data = {
      id: 'order-1',
      orderNumber: 136,
      status: 'COMPLETED',
      channel: 'PICKUP',
      estimatedDeliveryAt: null,
      createdAt: '2026-09-28T12:00:00.000Z',
      timeline: [
        { status: 'PENDING', at: '2026-09-28T12:01:00.000Z' },
        { status: 'COMPLETED', at: '2026-09-28T12:20:00.000Z' },
      ],
    }

    render(
      <MemoryRouter initialEntries={['/demo/conta/conversas']}>
        <AccountChats />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: 'Ver recibo e detalhes' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Acompanhar pedido' })
    ).not.toBeInTheDocument()
  })

  it('shows the logged consumer active order via session, no token', () => {
    // Arrange
    sessionState.consumer = { id: 'consumer-1' }
    myOrdersState.data = [
      {
        id: 'order-2',
        orderNumber: 201,
        status: 'PREPARING',
        channel: 'DELIVERY',
        totalAmount: '42.00',
        createdAt: '2026-09-28T12:00:00.000Z',
        estimatedDeliveryAt: null,
      },
    ]
    statusState.data = {
      id: 'order-2',
      orderNumber: 201,
      status: 'PREPARING',
      channel: 'DELIVERY',
      estimatedDeliveryAt: null,
      createdAt: '2026-09-28T12:00:00.000Z',
      timeline: [{ status: 'PREPARING', at: '2026-09-28T12:05:00.000Z' }],
    }

    // Act
    render(
      <MemoryRouter initialEntries={['/demo/conta/conversas']}>
        <AccountChats />
      </MemoryRouter>
    )

    // Assert
    expect(
      screen.getByRole('link', { name: 'Acompanhar pedido' })
    ).toHaveAttribute('href', '/pedido/order-2')
  })

  it('keeps the empty state for a logged consumer with no active order', () => {
    // Arrange
    sessionState.consumer = { id: 'consumer-1' }
    myOrdersState.data = [
      {
        id: 'order-2',
        orderNumber: 201,
        status: 'DELIVERED',
        channel: 'DELIVERY',
        totalAmount: '42.00',
        createdAt: '2026-09-28T12:00:00.000Z',
        estimatedDeliveryAt: null,
      },
    ]

    // Act
    render(
      <MemoryRouter initialEntries={['/demo/conta/conversas']}>
        <AccountChats />
      </MemoryRouter>
    )

    // Assert
    expect(
      screen.getByText('Nenhum pedido para acompanhar')
    ).toBeInTheDocument()
  })

  it('shows a store notification even without any tracked order', () => {
    // Arrange
    sessionState.consumer = { id: 'consumer-1' }
    notificationsState.data = [
      {
        id: 'notification-1',
        title: 'Cupom novo na loja',
        body: '10% off no seu próximo pedido com VOLTA10',
        data: { promotionId: 'promotion-1' },
        readAt: null,
        createdAt: '2026-09-28T12:00:00.000Z',
        updatedAt: '2026-09-28T12:00:00.000Z',
        type: { id: 'type-1', name: 'PROMOTION', description: 'Promoção' },
      },
    ]

    // Act
    render(
      <MemoryRouter initialEntries={['/demo/conta/conversas']}>
        <AccountChats />
      </MemoryRouter>
    )

    // Assert
    expect(
      screen.queryByText('Nenhum pedido para acompanhar')
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Cupom novo na loja' })
    ).toBeInTheDocument()
  })
})
