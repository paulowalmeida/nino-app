import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useChartGeometry } from '@hooks/ui/useChartGeometry'

describe(useChartGeometry.name, () => {
  it('uses the wide margin and full height above the narrow breakpoint', () => {
    // Arrange / Act
    const { result } = renderHook(() => useChartGeometry(600, 240))

    // Assert
    expect(result.current.isNarrow).toBe(false)
    expect(result.current.drawHeight).toBe(240)
    expect(result.current.innerWidth).toBeGreaterThan(0)
  })

  it('switches to the narrow margin and caps the height below 420px', () => {
    // Arrange / Act
    const { result } = renderHook(() => useChartGeometry(360, 240))

    // Assert
    expect(result.current.isNarrow).toBe(true)
    expect(result.current.drawHeight).toBe(180)
  })

  it('stays wide when the width has not been measured yet', () => {
    // Arrange / Act
    const { result } = renderHook(() => useChartGeometry(0, 240))

    // Assert
    expect(result.current.isNarrow).toBe(false)
    expect(result.current.innerWidth).toBe(0)
  })
})
