import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AddressSummary } from './AddressSummary'
import { addressSummaryMock } from './AddressSummary.mock'

describe('AddressSummary', () => {
  it('shows the address lines and the primary badge', () => {
    render(<AddressSummary address={addressSummaryMock.address} />)

    expect(screen.getByText('Rua das Flores, 123')).toBeInTheDocument()
    expect(
      screen.getByText('Centro · São Paulo/SP · 01001000')
    ).toBeInTheDocument()
    expect(screen.getByText('Principal')).toBeInTheDocument()
  })

  it('hides the primary badge for a secondary address', () => {
    render(
      <AddressSummary
        address={{ ...addressSummaryMock.address, isPrimary: false }}
      />
    )

    expect(screen.queryByText('Principal')).not.toBeInTheDocument()
  })
})
