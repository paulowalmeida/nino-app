import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CustomerOrderRow } from './CustomerOrderRow'
import {
  customerBackLinkMock,
  customerOrderRowMock,
} from './CustomerOrderRow.mock'

describe('CustomerOrderRow', () => {
  it('links to the order carrying its number, status, date, and total', () => {
    render(
      <MemoryRouter initialEntries={['/clientes/customer-1']}>
        <CustomerOrderRow
          order={customerOrderRowMock}
          backToCustomer={customerBackLinkMock}
          index={0}
        />
      </MemoryRouter>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveTextContent('#2B7C')
    expect(link).toHaveTextContent('entregue')
    expect(link).toHaveTextContent('R$ 89,90')
    expect(screen.getByText('10/02/2026 18:30')).toHaveAttribute(
      'datetime',
      customerOrderRowMock.createdAt
    )
  })
})
