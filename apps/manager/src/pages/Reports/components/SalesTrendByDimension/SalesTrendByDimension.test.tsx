import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SalesTrendByDimension } from './SalesTrendByDimension'
import { salesTrendByDimensionMock } from './SalesTrendByDimension.mock'

vi.mock('./SalesMultiChart/SalesMultiChart', () => ({
  SalesMultiChart: ({
    series,
    labelOf,
    label,
  }: {
    series: { key: string }[]
    labelOf: (key: string) => string
    label: string
  }) => (
    <div role="img" aria-label={label}>
      {series.map(({ key }) => labelOf(key))}
    </div>
  ),
}))

describe('SalesTrendByDimension', () => {
  it('titles the block and charts every line with its readable label', () => {
    render(
      <SalesTrendByDimension
        title="Faturamento por canal"
        breakdown={salesTrendByDimensionMock.breakdown}
        labelOf={() => 'Delivery'}
      />
    )

    expect(
      screen.getByRole('heading', { name: 'Faturamento por canal' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Faturamento por canal' })
    ).toHaveTextContent('Delivery')
  })
})
