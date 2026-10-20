import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SalesBreakdown } from './SalesBreakdown'
import { salesBreakdownMock } from './SalesBreakdown.mock'

describe('SalesBreakdown', () => {
  it('lists every slice with its label and value', () => {
    render(
      <SalesBreakdown
        title="Por canal"
        items={salesBreakdownMock.items}
        emptyMessage={salesBreakdownMock.emptyMessage}
      />
    )

    expect(
      screen.getByRole('heading', { name: 'Por canal' })
    ).toBeInTheDocument()
    expect(screen.getByText('Delivery')).toBeInTheDocument()
    expect(screen.getByText('R$ 50,00')).toBeInTheDocument()
    expect(
      screen.queryByText(salesBreakdownMock.emptyMessage)
    ).not.toBeInTheDocument()
  })

  it('shows the empty message when there is no slice', () => {
    render(
      <SalesBreakdown
        title="Por canal"
        items={[]}
        emptyMessage={salesBreakdownMock.emptyMessage}
      />
    )

    expect(
      screen.getByText(salesBreakdownMock.emptyMessage)
    ).toBeInTheDocument()
  })
})
