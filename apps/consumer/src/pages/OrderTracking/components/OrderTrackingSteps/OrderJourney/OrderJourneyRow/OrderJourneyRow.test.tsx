import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OrderJourneyRow } from './OrderJourneyRow'
import { orderJourneyRowMock } from './OrderJourneyRow.mock'

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
