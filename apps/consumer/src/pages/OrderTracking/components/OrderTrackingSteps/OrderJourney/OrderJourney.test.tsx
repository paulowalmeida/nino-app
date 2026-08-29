import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OrderJourney } from './OrderJourney'
import { orderJourneyMock } from './OrderJourney.mock'
vi.mock(
  '@pages/order-tracking/adapters/orderJourneyRows.adapter/orderJourneyRows.adapter',
  () => ({
    orderJourneyRows: () => [],
  })
)
describe('OrderJourney', () => {
  it('renders the journey list', () => {
    const { container } = render(
      <OrderJourney
        order={{} as never}
        className={orderJourneyMock.className}
      />
    )
    expect(container.querySelector('ol')).toHaveClass(
      orderJourneyMock.className
    )
  })
})
