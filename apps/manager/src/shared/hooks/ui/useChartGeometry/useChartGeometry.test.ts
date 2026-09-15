import { describe, expect, it } from 'vitest'

import { useChartGeometry } from './useChartGeometry'
import { chartGeometryMock } from './useChartGeometry.mock'

describe(useChartGeometry.name, () => {
  it('uses the narrow layout below the breakpoint', () => {
    const result = useChartGeometry(chartGeometryMock.narrowWidth, chartGeometryMock.height)
    expect(result.isNarrow).toBe(true)
    expect(result.drawHeight).toBeLessThanOrEqual(180)
  })

  it('never returns negative inner dimensions', () => {
    const result = useChartGeometry(0, 0)
    expect(result.innerWidth).toBe(0)
    expect(result.innerHeight).toBe(0)
  })
})
