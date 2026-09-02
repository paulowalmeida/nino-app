import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { OrderJourney } from './OrderJourney'
import { orderJourneyMock } from './OrderJourney.mock'

const journeyState = vi.hoisted(() => ({
  rows: [
    { status: 'PREPARING', at: undefined, state: 'done' },
    { status: 'OUT_FOR_DELIVERY', at: undefined, state: 'ahead' },
  ] as Array<{
    status: string
    at: string | undefined
    state: 'done' | 'ahead' | 'final'
  }>,
}))

vi.mock(
  '@pages/order-tracking/adapters/orderJourneyRows.adapter/orderJourneyRows.adapter',
  () => ({
    orderJourneyRows: () => journeyState.rows,
  })
)
describe('OrderJourney', () => {
  beforeEach(() => {
    journeyState.rows = [
      { status: 'PREPARING', at: undefined, state: 'done' },
      { status: 'OUT_FOR_DELIVERY', at: undefined, state: 'ahead' },
    ]
  })

  it('renders the journey list', () => {
    const { container } = render(
      <OrderJourney
        order={{ estimatedDeliveryAt: '2026-08-29T20:00:00.000Z' } as never}
        className={orderJourneyMock.className}
      />
    )
    expect(container.querySelector('ol')).toHaveClass(
      orderJourneyMock.className
    )
  })

  it('renders without an estimate marker when the final row is not ahead', () => {
    journeyState.rows = [
      { status: 'DELIVERED', at: '2026-08-29T20:00:00.000Z', state: 'final' },
    ]

    const { container } = render(<OrderJourney order={{} as never} />)

    expect(container.querySelector('ol')).toBeInTheDocument()
  })

  it('renders an ahead row without an estimate when none is available', () => {
    journeyState.rows = [
      { status: 'OUT_FOR_DELIVERY', at: undefined, state: 'ahead' },
    ]

    const { container } = render(<OrderJourney order={{} as never} />)

    expect(container.querySelector('ol')).toBeInTheDocument()
  })
})
