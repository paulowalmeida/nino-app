import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CustomerRow } from './CustomerRow'
import { customerRowMock } from './CustomerRow.mock'

describe('CustomerRow', () => {
  it('links to the customer file carrying money, orders and points', () => {
    render(
      <MemoryRouter>
        <ul>
          <CustomerRow customer={customerRowMock} index={0} />
        </ul>
      </MemoryRouter>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/${customerRowMock.id}`)
    expect(link).toHaveTextContent(customerRowMock.name)
    expect(link).toHaveTextContent(customerRowMock.phoneLabel)
    expect(link).toHaveTextContent('R$ 890,50')
    expect(link).toHaveTextContent('12 pedidos')
    expect(link).toHaveTextContent(customerRowMock.sinceLabel)
  })
})
