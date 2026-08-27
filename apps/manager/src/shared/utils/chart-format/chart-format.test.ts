import { describe, expect, it } from 'vitest'

import { chartTickLabel } from './chart-format'

describe('chartTickLabel', () => {
  it('formats an hourly tick as hour and minute', () => {
    const date = new Date('2026-08-01T14:30:00')
    expect(chartTickLabel('hour', date)).toBe('14:30')
  })

  it('formats a daily tick as day and month', () => {
    const date = new Date('2026-08-01T14:30:00')
    expect(chartTickLabel('day', date)).toBe('01/08')
  })
})
