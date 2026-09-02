import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { OrderNotFound } from './OrderNotFound'
import { orderNotFoundMock } from './OrderNotFound.mock'

describe('OrderNotFound', () => {
  it('explains an inaccessible order and links back', () => {
    render(
      <MemoryRouter>
        <OrderNotFound backHref={orderNotFoundMock.backHref} reason="access" />
      </MemoryRouter>
    )
    expect(
      screen.getByText(/Abra pelo link que apareceu na hora do pedido/)
    ).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      orderNotFoundMock.backHref
    )
  })

  it('explains an invalid order link', () => {
    render(
      <MemoryRouter>
        <OrderNotFound
          backHref={orderNotFoundMock.backHref}
          reason="invalid-link"
        />
      </MemoryRouter>
    )

    expect(
      screen.getByText(/Confira o link — ele é o mesmo/)
    ).toBeInTheDocument()
  })
})
