import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ChartAxes } from '@molecules/ChartAxes/ChartAxes'

import { xScale, yScale } from './ChartAxes.mock'

describe(ChartAxes.name, () => {
  it('formats x-axis ticks with the day label for day granularity', () => {
    // Arrange / Act
    render(
      <svg>
        <ChartAxes
          xScale={xScale}
          yScale={yScale}
          innerWidth={200}
          innerHeight={80}
          isNarrow={false}
          pointCount={5}
          granularity="day"
          yTickFormat={(value) => String(value)}
        />
      </svg>
    )

    // Assert
    expect(screen.getByText('01/07')).toBeInTheDocument()
  })

  it('formats x-axis ticks with the hour label for hour granularity', () => {
    // Arrange / Act
    render(
      <svg>
        <ChartAxes
          xScale={xScale}
          yScale={yScale}
          innerWidth={200}
          innerHeight={80}
          isNarrow={false}
          pointCount={5}
          granularity="hour"
          yTickFormat={(value) => String(value)}
        />
      </svg>
    )

    // Assert
    expect(screen.queryByText('01/07')).not.toBeInTheDocument()
  })

  it('formats y-axis ticks with the given formatter', () => {
    // Arrange / Act
    render(
      <svg>
        <ChartAxes
          xScale={xScale}
          yScale={yScale}
          innerWidth={200}
          innerHeight={80}
          isNarrow={false}
          pointCount={5}
          granularity="day"
          yTickFormat={(value) => `R$ ${value}`}
        />
      </svg>
    )

    // Assert
    expect(screen.getByText('R$ 0')).toBeInTheDocument()
  })
})
