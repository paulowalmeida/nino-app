import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AccountChats } from './AccountChats'

const statusState = vi.hoisted(() => ({
  data: undefined as unknown,
  isPending: false,
  isError: false,
}))

vi.mock('@hooks/useGuestOrderStatus/useGuestOrderStatus', () => ({
  useGuestOrderStatus: () => statusState,
}))

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
})
