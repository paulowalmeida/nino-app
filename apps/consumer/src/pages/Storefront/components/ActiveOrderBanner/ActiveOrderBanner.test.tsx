import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'
import { useGuestOrders } from '@shared/hooks/useGuestOrders/useGuestOrders'
import { useGuestOrderStatus } from '@hooks/useGuestOrderStatus/useGuestOrderStatus'
import { useMinutesUntil } from '@hooks/useMinutesUntil/useMinutesUntil'
import { useMyOrders } from '@shared/hooks/useMyOrders/useMyOrders'

import { ActiveOrderBanner } from './ActiveOrderBanner'
import {
  activeOrderBannerMock,
  activeOrderMock,
  guestOrderMock,
} from './ActiveOrderBanner.mock'

vi.mock('@shared/hooks/useConsumerSession/useConsumerSession')
vi.mock('@shared/hooks/useGuestOrders/useGuestOrders')
vi.mock('@hooks/useGuestOrderStatus/useGuestOrderStatus')
vi.mock('@hooks/useMinutesUntil/useMinutesUntil')
vi.mock('@shared/hooks/useMyOrders/useMyOrders')
vi.mock('@utils/last-order', () => ({ recordGuestOrderStatus: vi.fn() }))

const renderBanner = () =>
  render(
    <MemoryRouter>
      <ActiveOrderBanner slug={activeOrderBannerMock.slug} />
    </MemoryRouter>
  )

describe('ActiveOrderBanner', () => {
  beforeEach(() => {
    vi.mocked(useConsumerSession).mockReturnValue({ consumer: null } as never)
    vi.mocked(useGuestOrders).mockReturnValue([guestOrderMock] as never)
    vi.mocked(useMyOrders).mockReturnValue({ data: [] } as never)
    vi.mocked(useMinutesUntil).mockReturnValue(12)
    vi.mocked(useGuestOrderStatus).mockReturnValue({
      data: activeOrderMock,
    } as never)
  })

  it('links to the tracking page with the current step and the estimate', () => {
    renderBanner()

    const link = screen.getByRole('link', { name: /Acompanhar pedido/ })
    expect(link).toHaveAttribute(
      'href',
      `/${activeOrderBannerMock.slug}/pedido/${guestOrderMock.orderId}?token=${guestOrderMock.token}`
    )
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('leaves the estimate out when there is none', () => {
    vi.mocked(useMinutesUntil).mockReturnValue(null)

    renderBanner()

    expect(screen.queryByText('min')).not.toBeInTheDocument()
  })

  it('hides once the order is over', () => {
    vi.mocked(useGuestOrderStatus).mockReturnValue({
      data: { ...activeOrderMock, status: 'DELIVERED' },
    } as never)

    const { container } = renderBanner()

    expect(container).toBeEmptyDOMElement()
  })
})
