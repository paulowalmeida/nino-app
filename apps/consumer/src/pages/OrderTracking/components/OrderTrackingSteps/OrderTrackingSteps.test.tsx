import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OrderTrackingSteps } from './OrderTrackingSteps'
import { orderTrackingStepsMock } from './OrderTrackingSteps.mock'

vi.mock('./OrderJourney/OrderJourney', () => ({
  OrderJourney: () => <p>Jornada</p>,
}))
describe('OrderTrackingSteps', () => {
  it('labels and renders the order journey', () => {
    render(
      <OrderTrackingSteps
        order={{ status: orderTrackingStepsMock.status } as never}
      />
    )
    expect(screen.getByText('Passo a passo')).toBeInTheDocument()
    expect(screen.getByText('Jornada')).toBeInTheDocument()
  })
})
