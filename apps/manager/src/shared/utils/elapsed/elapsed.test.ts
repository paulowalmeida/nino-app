import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { elapsedSince } from './elapsed'

const NOW = new Date('2026-08-01T12:00:00.000Z')

describe('elapsedSince', () => {
  beforeEach(() => vi.setSystemTime(NOW))
  afterEach(() => vi.useRealTimers())

  it('reads minutes under the late threshold as on time', () => {
    const iso = new Date(NOW.getTime() - 5 * 60_000).toISOString()
    expect(elapsedSince(iso)).toEqual({
      label: '5 min',
      isLate: false,
      ratio: 0.25,
    })
  })

  it('marks an order late once it crosses the threshold', () => {
    const iso = new Date(NOW.getTime() - 20 * 60_000).toISOString()
    const result = elapsedSince(iso)
    expect(result.isLate).toBe(true)
    expect(result.ratio).toBe(1)
  })

  it('switches to hour formatting past sixty minutes', () => {
    const iso = new Date(NOW.getTime() - 90 * 60_000).toISOString()
    expect(elapsedSince(iso)).toEqual({
      label: '1h30',
      isLate: true,
      ratio: 1,
    })
  })
})
