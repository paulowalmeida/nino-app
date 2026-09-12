import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ConsumerOrderRow } from './ConsumerOrderRow'
import {
  consumerBackLinkMock,
  consumerOrderRowMock,
} from './ConsumerOrderRow.mock'

describe('ConsumerOrderRow', () => {
  it('shows the order number, status, date, and total in the row', () => {
    render(
      <MemoryRouter initialEntries={['/clientes/consumer-1']}>
        <table>
          <tbody>
            <ConsumerOrderRow
              order={consumerOrderRowMock}
              backToConsumer={consumerBackLinkMock}
              index={0}
            />
          </tbody>
        </table>
      </MemoryRouter>
    )

    const row = screen.getByRole('row')
    expect(screen.getByRole('link')).toHaveTextContent('#2B7C')
    expect(row).toHaveTextContent('entregue')
    expect(row).toHaveTextContent('R$ 89,90')
    expect(screen.getByText('10/02/2026 18:30')).toHaveAttribute(
      'datetime',
      consumerOrderRowMock.createdAt
    )
  })
})
