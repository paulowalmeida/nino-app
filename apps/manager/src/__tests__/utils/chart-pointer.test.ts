import { describe, expect, it } from 'vitest'

import { nearestIndexByTime } from '@utils/chart-pointer'

describe(nearestIndexByTime.name, () => {
  it('picks the item whose time is closest to the target', () => {
    // Arrange
    const items = [
      { at: new Date('2026-07-01T00:00:00Z') },
      { at: new Date('2026-07-02T00:00:00Z') },
      { at: new Date('2026-07-03T00:00:00Z') },
    ]

    // Act
    const index = nearestIndexByTime(
      items,
      new Date('2026-07-02T10:00:00Z').getTime()
    )

    // Assert
    expect(index).toBe(1)
  })

  it('returns 0 with a single item', () => {
    // Arrange
    const items = [{ at: new Date('2026-07-01T00:00:00Z') }]

    // Act
    const index = nearestIndexByTime(items, Date.now())

    // Assert
    expect(index).toBe(0)
  })
})
