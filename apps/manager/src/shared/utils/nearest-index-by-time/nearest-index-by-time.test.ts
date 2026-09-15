import { describe, expect, it } from 'vitest'

import { nearestIndexByTime } from './nearest-index-by-time'

describe('nearestIndexByTime', () => {
  it('finds the index whose timestamp is closest to the target time', () => {
    // Arrange
    const items = [
      { at: new Date('2026-01-01T10:00:00') },
      { at: new Date('2026-01-01T10:05:00') },
      { at: new Date('2026-01-01T10:10:00') },
    ]
    const target = new Date('2026-01-01T10:06:00').getTime()

    // Act
    const index = nearestIndexByTime(items, target)

    // Assert
    expect(index).toBe(1)
  })

  it('returns the only index for a single-item list', () => {
    const items = [{ at: new Date('2026-01-01T10:00:00') }]
    expect(nearestIndexByTime(items, Date.now())).toBe(0)
  })

  it('returns null for an empty list', () => {
    expect(nearestIndexByTime([], Date.now())).toBeNull()
  })
})
