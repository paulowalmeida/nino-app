import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { OrderTracking } from './OrderTracking'
import { orderTrackingMock } from './OrderTracking.mock'
vi.mock(
  '@pages/order-tracking/facades/useOrderTrackingFacade/useOrderTrackingFacade',
  () => ({
    useOrderTrackingFacade: () => ({
      ...orderTrackingMock,
      order: undefined,
      isPending: false,
      isSessionPending: false,
      isError: false,
      canAsk: false,
      done: false,
    }),
  })
)
describe('OrderTracking', () => {
  it('shows the missing-order guidance when lookup is not allowed', () => {
    render(
      <MemoryRouter>
        <OrderTracking />
      </MemoryRouter>
    )
    expect(screen.getByText('Pedido não encontrado')).toBeInTheDocument()
  })
})
