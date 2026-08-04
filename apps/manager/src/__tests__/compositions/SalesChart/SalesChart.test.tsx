import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SalesChart } from '@compositions/SalesChart/SalesChart'

import { singleDayPoint, threeDayPoints } from './SalesChart.mock'

describe(SalesChart.name, () => {
  it('draws the chart with an accessible label', () => {
    // Arrange / Act
    render(
      <SalesChart
        points={threeDayPoints}
        granularity="day"
        label="Faturamento por dia"
      />
    )

    // Assert
    expect(
      screen.getByRole('img', { name: 'Faturamento por dia' })
    ).toBeInTheDocument()
  })

  it('renders nothing with fewer than two points', () => {
    // Arrange / Act
    const { container } = render(
      <SalesChart
        points={singleDayPoint}
        granularity="day"
        label="Faturamento por dia"
      />
    )

    // Assert
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing with no points at all', () => {
    // Arrange / Act
    const { container } = render(
      <SalesChart points={[]} granularity="day" label="Faturamento por dia" />
    )

    // Assert
    expect(container).toBeEmptyDOMElement()
  })
})
