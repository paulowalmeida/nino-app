import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OrderJourneyRow } from './OrderJourneyRow'
import { orderJourneyRowMock } from './OrderJourneyRow.mock'
describe('OrderJourneyRow', () => {
  it('renders an order stage row', () => {
    render(
      <OrderJourneyRow
        {...orderJourneyRowMock}
        row={orderJourneyRowMock.row as never}
      />
    )
    expect(screen.getByRole('listitem')).toBeInTheDocument()
  })
})
