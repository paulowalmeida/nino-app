import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { OrderTrackingHeader } from './OrderTrackingHeader'
import { orderTrackingHeaderMock } from './OrderTrackingHeader.mock'

describe('OrderTrackingHeader', () => {
  it('identifies the order and exposes a return link', () => {
    render(
      <MemoryRouter>
        <OrderTrackingHeader {...orderTrackingHeaderMock} />
      </MemoryRouter>
    )
    expect(
      screen.getByRole('heading', { name: 'Seu pedido' })
    ).toBeInTheDocument()
    expect(screen.getByText('#42')).toBeInTheDocument()
  })
})
