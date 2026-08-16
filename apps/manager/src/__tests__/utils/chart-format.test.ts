import { describe, expect, it } from 'vitest'

import { chartTickLabel } from '@utils/chart-format'

describe(chartTickLabel.name, () => {
  it('formats as hour:minute for hour granularity', () => {
    // Arrange
    const date = new Date('2026-07-01T14:30:00Z')

    // Act
    const label = chartTickLabel('hour', date)

    // Assert
    expect(label).toMatch(/^\d{2}:\d{2}$/)
  })

  it('formats as day/month for day granularity', () => {
    // Arrange
    const date = new Date('2026-07-01T14:30:00Z')

    // Act
    const label = chartTickLabel('day', date)

    // Assert
    expect(label).toBe('01/07')
  })
})
