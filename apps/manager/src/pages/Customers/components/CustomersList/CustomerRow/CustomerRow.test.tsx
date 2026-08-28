import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CustomerRow } from './CustomerRow'
import { customerRowMock } from './CustomerRow.mock'

describe('CustomerRow', () => {
  it('links the name to the customer file and shows the row stats', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <CustomerRow customer={customerRowMock} index={0} />
          </tbody>
        </table>
      </MemoryRouter>
    )

    const row = screen.getByRole('row')
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/${customerRowMock.id}`)
    expect(link).toHaveTextContent(customerRowMock.name)
    expect(row).toHaveTextContent(customerRowMock.phoneLabel)
    expect(row).toHaveTextContent('R$ 890,50')
    expect(row).toHaveTextContent('12 pedidos')
    expect(row).toHaveTextContent(customerRowMock.sinceLabel)
  })
})
