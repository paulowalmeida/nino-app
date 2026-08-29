import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { elapsedSince } from './elapsed'

const NOW = new Date('2026-08-01T12:00:00.000Z')

const minutesAgo = (minutes: number): string =>
  new Date(NOW.getTime() - minutes * 60_000).toISOString()

describe('elapsedSince', () => {
  beforeEach(() => vi.setSystemTime(NOW))
  afterEach(() => vi.useRealTimers())

  it('reads minutes under the late threshold as on time', () => {
    expect(elapsedSince(minutesAgo(5))).toEqual({
      label: '5 min',
      remaining: '15 min',
      isLate: false,
      pace: 'fresh',
      ratio: 0.25,
      overdueRatio: 0,
    })
  })

  it('turns the ruler amber in the last stretch of the deadline', () => {
    // Arrange: 10 de 20 minutos gastos alcança o degrau de 50%
    const result = elapsedSince(minutesAgo(10))

    // Assert
    expect(result.pace).toBe('closing')
    expect(result.remaining).toBe('10 min')
  })

  it('turns the ruler red before the deadline runs out', () => {
    // Arrange: 15 de 20 minutos gastos alcança o degrau de 75%
    const result = elapsedSince(minutesAgo(15))

    // Assert
    expect(result.pace).toBe('due')
    expect(result.isLate).toBe(false)
  })

  it('marks an order late once it crosses the threshold', () => {
    const result = elapsedSince(minutesAgo(20))
    expect(result.isLate).toBe(true)
    expect(result.pace).toBe('late')
    expect(result.ratio).toBe(1)
    expect(result.overdueRatio).toBe(0)
  })

  it('counts the delay down past zero once the deadline is gone', () => {
    expect(elapsedSince(minutesAgo(32)).remaining).toBe('-12 min')
  })

  it('keeps an overdue ruler fully red from the first late minute', () => {
    expect(elapsedSince(minutesAgo(50)).overdueRatio).toBe(0)
  })

  it('switches to hour formatting past sixty minutes', () => {
    expect(elapsedSince(minutesAgo(90))).toEqual({
      label: '1h30',
      remaining: '-1h10',
      isLate: true,
      pace: 'late',
      ratio: 1,
      overdueRatio: 0,
    })
  })
})
