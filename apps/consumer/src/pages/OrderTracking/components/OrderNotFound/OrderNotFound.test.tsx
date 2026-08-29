import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { OrderNotFound } from './OrderNotFound'
import { orderNotFoundMock } from './OrderNotFound.mock'
describe('OrderNotFound', () => {
  it('explains the missing order and links back', () => {
    render(
      <MemoryRouter>
        <OrderNotFound backHref={orderNotFoundMock.backHref}>
          {orderNotFoundMock.message}
        </OrderNotFound>
      </MemoryRouter>
    )
    expect(screen.getByText(orderNotFoundMock.message)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      orderNotFoundMock.backHref
    )
  })
})
