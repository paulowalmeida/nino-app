import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrderTrackingReassurance } from './OrderTrackingReassurance'
import { orderTrackingReassuranceMock } from './OrderTrackingReassurance.mock'

vi.mock('@hooks/useStoreTracking/useStoreTracking', () => ({
  useStoreTracking: () => ({
    stageLabel: (status: string) =>
      ({
        PENDING: 'Recebemos seu pedido',
        ACCEPTED: 'A loja aceitou seu pedido',
        PREPARING: 'Sua comida está sendo preparada',
        OUT_FOR_DELIVERY: 'Seu pedido saiu para entrega',
        READY_FOR_PICKUP: 'Seu pedido está pronto para retirada',
        DELIVERED: 'Pedido entregue',
        COMPLETED: 'Pedido retirado',
        CANCELLED: 'Pedido cancelado',
      })[status],
    waitingMessage: null,
  }),
}))


describe('OrderTrackingReassurance', () => {
  it('reassures the consumer about WhatsApp updates', () => {
    render(<OrderTrackingReassurance />)
    expect(
      screen.getByText(new RegExp(orderTrackingReassuranceMock.message))
    ).toBeInTheDocument()
  })
})
