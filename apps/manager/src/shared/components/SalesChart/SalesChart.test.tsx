import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SalesChart } from './SalesChart'
import { salesChartPointsMock } from './SalesChart.mock'

describe(SalesChart.name, () => {
  it('renders an accessible chart when it has enough points', () => {
    const { container } = render(
      <SalesChart points={salesChartPointsMock} granularity="day" label="Vendas" />
    )
    expect(container.querySelector('svg[role="img"]')).toHaveAttribute('aria-label', 'Vendas')
  })
})
