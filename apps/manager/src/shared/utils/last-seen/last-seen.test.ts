import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { lastSeenLabel } from './last-seen'

const NOW = new Date('2026-08-15T18:00:00')

describe('lastSeenLabel', () => {
  beforeEach(() => vi.setSystemTime(NOW))
  afterEach(() => vi.useRealTimers())

  it('labels a member who has not logged in yet', () => {
    expect(lastSeenLabel(null)).toBe('Nunca entrou')
  })

  it('labels an unparsable timestamp the same way', () => {
    expect(lastSeenLabel('not-a-date')).toBe('Nunca entrou')
  })

  it('labels the same day as today with the time', () => {
    expect(lastSeenLabel('2026-08-15T09:00:00')).toBe('Hoje às 09:00')
  })

  it('labels the previous day as yesterday with the time', () => {
    expect(lastSeenLabel('2026-08-14T09:00:00')).toBe('Ontem às 09:00')
  })

  it('labels a day within the week by date and time', () => {
    expect(lastSeenLabel('2026-08-10T09:00:00')).toBe('10 de ago. às 09:00')
  })

  it('labels an older day this year by date only', () => {
    expect(lastSeenLabel('2026-01-05T09:00:00')).toBe('05 de jan.')
  })

  it('labels a day from a previous year with the full date', () => {
    expect(lastSeenLabel('2025-08-01T09:00:00')).toBe('01 de ago. de 2025')
  })
})
