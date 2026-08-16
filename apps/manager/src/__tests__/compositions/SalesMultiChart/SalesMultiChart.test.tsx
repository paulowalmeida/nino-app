import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SalesMultiChart } from '@compositions/SalesMultiChart/SalesMultiChart'

import { singleLineSingleDay, twoLinesTwoDays } from './SalesMultiChart.mock'

const labelOf = (key: string): string =>
  key === 'DELIVERY' ? 'Entrega' : 'Retirada'

describe(SalesMultiChart.name, () => {
  it('draws the chart with a label and a legend entry per line', () => {
    // Arrange / Act
    render(
      <SalesMultiChart
        series={twoLinesTwoDays}
        granularity="day"
        labelOf={labelOf}
        label="Faturamento por canal"
      />
    )

    // Assert
    expect(
      screen.getByRole('img', { name: 'Faturamento por canal' })
    ).toBeInTheDocument()
    expect(screen.getByText('Entrega')).toBeInTheDocument()
    expect(screen.getByText('Retirada')).toBeInTheDocument()
  })

  it('renders nothing when the first line has fewer than two points', () => {
    // Arrange / Act
    const { container } = render(
      <SalesMultiChart
        series={singleLineSingleDay}
        granularity="day"
        labelOf={labelOf}
        label="Faturamento por canal"
      />
    )

    // Assert
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing with no series at all', () => {
    // Arrange / Act
    const { container } = render(
      <SalesMultiChart
        series={[]}
        granularity="day"
        labelOf={labelOf}
        label="Faturamento por canal"
      />
    )

    // Assert
    expect(container).toBeEmptyDOMElement()
  })
})
