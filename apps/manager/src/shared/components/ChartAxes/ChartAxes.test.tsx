import { render } from '@testing-library/react'
import { scaleLinear, scaleTime } from '@visx/scale'
import { describe, expect, it } from 'vitest'

import { ChartAxes } from './ChartAxes'
import { chartAxesMock } from './ChartAxes.mock'

describe(ChartAxes.name, () => {
  it('draws grid and axis elements for the supplied scales', () => {
    const { container } = render(
      <svg>
        <ChartAxes
          xScale={scaleTime({ domain: [new Date('2026-01-01'), new Date('2026-01-04')], range: [0, chartAxesMock.innerWidth] })}
          yScale={scaleLinear({ domain: [0, 100], range: [chartAxesMock.innerHeight, 0] })}
          {...chartAxesMock}
          isNarrow={false}
          yTickFormat={String}
        />
      </svg>
    )
    expect(container.querySelectorAll('line').length).toBeGreaterThan(0)
  })
})
