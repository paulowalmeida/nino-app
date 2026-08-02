import { afterEach, describe, expect, it, vi } from 'vitest'

import { lastSeenLabel } from './last-seen'

const at = (
  year: number,
  month: number,
  day: number,
  hour = 10,
  minute = 0
): string => new Date(year, month, day, hour, minute).toISOString()

describe('last-seen', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  const freezeAt = (date: Date) => {
    vi.useFakeTimers()
    vi.setSystemTime(date)
  }

  it('names an account that never signed in', () => {
    expect(lastSeenLabel(null)).toBe('Nunca entrou')
  })

  it('names today with the time', () => {
    freezeAt(new Date(2026, 7, 2, 18, 0))
    expect(lastSeenLabel(at(2026, 7, 2, 14, 20))).toBe('Hoje às 14:20')
  })

  /* meia-noite e dez ainda é ontem para quem lê, mesmo com poucas horas de
     diferença — o corte é o dia do calendário, não 24 horas corridas */
  it('names yesterday by the calendar, not by elapsed hours', () => {
    freezeAt(new Date(2026, 7, 2, 0, 10))
    expect(lastSeenLabel(at(2026, 7, 1, 23, 50))).toBe('Ontem às 23:50')
  })

  it('keeps the time within the week', () => {
    freezeAt(new Date(2026, 7, 2, 12, 0))
    expect(lastSeenLabel(at(2026, 6, 29, 9, 5))).toContain('às 09:05')
  })

  it('drops the time after a week', () => {
    freezeAt(new Date(2026, 7, 2, 12, 0))
    expect(lastSeenLabel(at(2026, 6, 1, 9, 5))).not.toContain('às')
  })

  it('spells out the year for an older sign-in', () => {
    freezeAt(new Date(2026, 7, 2, 12, 0))
    expect(lastSeenLabel(at(2025, 10, 3))).toContain('2025')
  })

  it('treats a broken date as never', () => {
    expect(lastSeenLabel('not-a-date')).toBe('Nunca entrou')
  })
})
