import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OrderJourneyRow } from './OrderJourneyRow'
import { orderJourneyRowMock } from './OrderJourneyRow.mock'

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


describe('OrderJourneyRow', () => {
  it('renders an order stage row', () => {
    render(
      <OrderJourneyRow
        {...orderJourneyRowMock}
        row={orderJourneyRowMock.row as never}
      />
    )
    expect(screen.getByRole('listitem')).toBeInTheDocument()
  })

  it('renders a current row with its recorded time', () => {
    render(
      <OrderJourneyRow
        row={
          {
            status: 'PREPARING',
            state: 'current',
            at: '2026-08-29T20:10:00.000Z',
          } as never
        }
        index={0}
      />
    )

    expect(screen.getByText('17h10')).toBeInTheDocument()
  })

  it('renders an estimated time for a future row', () => {
    render(
      <OrderJourneyRow
        row={{ status: 'OUT_FOR_DELIVERY', state: 'ahead' } as never}
        index={0}
        estimatedAt="2026-08-29T20:30:00.000Z"
      />
    )

    expect(screen.getByText('~ 17h30')).toBeInTheDocument()
  })

  it('keeps the cancelled marker instead of the completion check', () => {
    render(
      <OrderJourneyRow
        row={{ status: 'CANCELLED', state: 'final' } as never}
        index={0}
      />
    )

    expect(screen.getByText('Pedido cancelado')).toBeInTheDocument()
  })
})
