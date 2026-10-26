import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SalesPeriodTrend } from './SalesPeriodTrend'
import { salesPeriodTrendMock } from './SalesPeriodTrend.mock'

vi.mock('@shared/components/SalesChart/SalesChart', () => ({
  SalesChart: ({
    points,
    granularity,
    label,
  }: {
    points: unknown[]
    granularity: string
    label: string
  }) => (
    <div role="img" aria-label={label}>
      {granularity}:{points.length}
    </div>
  ),
}))

describe('SalesPeriodTrend', () => {
  it('draws the revenue of the period with the series granularity', () => {
    render(<SalesPeriodTrend series={salesPeriodTrendMock.series} />)

    expect(
      screen.getByRole('heading', { name: 'Faturamento no período' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Faturamento por período no relatório' })
    ).toHaveTextContent('day:1')
  })
})
