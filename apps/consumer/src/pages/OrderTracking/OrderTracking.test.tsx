import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { useOrderTrackingFacade } from '@pages/order-tracking/facades/useOrderTrackingFacade/useOrderTrackingFacade'

import { OrderTracking } from './OrderTracking'
import { orderTrackingMock } from './OrderTracking.mock'

vi.mock(
  '@pages/order-tracking/facades/useOrderTrackingFacade/useOrderTrackingFacade'
)
vi.mock('@pages/order-tracking/components/OrderNotFound/OrderNotFound', () => ({
  OrderNotFound: ({ reason }: { reason: string }) => <p>{reason}</p>,
}))
vi.mock(
  '@pages/OrderTracking/skeletons/OrderTrackingSkeleton/OrderTrackingSkeleton',
  () => ({
    OrderTrackingSkeleton: () => <p>loading</p>,
  })
)
vi.mock(
  '@pages/order-tracking/components/OrderTrackingHeader/OrderTrackingHeader',
  () => ({
    OrderTrackingHeader: () => <p>header</p>,
  })
)
vi.mock('@pages/order-tracking/components/OrderStage/OrderStage', () => ({
  OrderStage: () => <p>stage</p>,
}))
vi.mock(
  '@pages/order-tracking/components/OrderTrackingReassurance/OrderTrackingReassurance',
  () => ({
    OrderTrackingReassurance: () => <p>reassurance</p>,
  })
)
vi.mock(
  '@pages/order-tracking/components/OrderTrackingSteps/OrderTrackingSteps',
  () => ({
    OrderTrackingSteps: () => <p>steps</p>,
  })
)
vi.mock(
  '@pages/order-tracking/components/OrderTrackingAgainLink/OrderTrackingAgainLink',
  () => ({
    OrderTrackingAgainLink: () => <p>again</p>,
  })
)
vi.mock('@shared/components/PoweredBy/PoweredBy', () => ({
  PoweredBy: () => <p>powered</p>,
}))

const renderTracking = () =>
  render(
    <MemoryRouter>
      <OrderTracking />
    </MemoryRouter>
  )

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useOrderTrackingFacade).mockReturnValue({
    backHref: orderTrackingMock.backHref,
    progress: orderTrackingMock.progress,
    order: undefined,
    isPending: false,
    isSessionPending: false,
    isError: false,
    canAsk: false,
    done: false,
    ...overrides,
  } as never)

describe('OrderTracking', () => {
  it('shows guidance when lookup is not allowed', () => {
    facadeWith({})

    renderTracking()

    expect(screen.getByText('access')).toBeInTheDocument()
  })

  it('shows loading while session or order status is pending', () => {
    facadeWith({ isSessionPending: true })

    renderTracking()

    expect(screen.getByText('loading')).toBeInTheDocument()
  })

  it('shows invalid-link guidance after an order lookup error', () => {
    facadeWith({ canAsk: true, isError: true })

    renderTracking()

    expect(screen.getByText('invalid-link')).toBeInTheDocument()
  })

  it('composes the active order screen', () => {
    facadeWith({ canAsk: true, order: orderTrackingMock.order })

    renderTracking()

    expect(screen.getByText('stage')).toBeInTheDocument()
    expect(screen.getByText('reassurance')).toBeInTheDocument()
    expect(screen.getByText('steps')).toBeInTheDocument()
  })

  it('composes the completed order action', () => {
    facadeWith({
      canAsk: true,
      done: true,
      order: { ...orderTrackingMock.order, status: 'DELIVERED' },
    })

    renderTracking()

    expect(screen.getByText('again')).toBeInTheDocument()
    expect(screen.queryByText('reassurance')).not.toBeInTheDocument()
  })
})
