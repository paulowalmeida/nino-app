import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { OrderTrackingAgainLink } from './OrderTrackingAgainLink'
import { orderTrackingAgainLinkMock } from './OrderTrackingAgainLink.mock'

describe('OrderTrackingAgainLink', () => {
  it('uses a quiet return label after cancellation', () => {
    render(
      <MemoryRouter>
        <OrderTrackingAgainLink
          {...orderTrackingAgainLinkMock}
          status="CANCELLED"
        />
      </MemoryRouter>
    )
    expect(
      screen.getByRole('link', { name: 'Voltar ao cardápio' })
    ).toHaveAttribute('href', orderTrackingAgainLinkMock.backHref)
  })

  it('offers a repeat-order action for completed orders', () => {
    render(
      <MemoryRouter>
        <OrderTrackingAgainLink
          {...orderTrackingAgainLinkMock}
          status="DELIVERED"
        />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Pedir de novo' })).toHaveAttribute(
      'href',
      orderTrackingAgainLinkMock.backHref
    )
  })
})
