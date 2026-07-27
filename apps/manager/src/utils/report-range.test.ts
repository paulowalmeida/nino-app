import { describe, expect, it } from 'vitest'

import { customRange, MAX_RANGE_MONTHS, rangeOf } from './report-range'

/* `from`/`to` são bordas do dia LOCAL; ler a fatia do ISO compararia o dia
   em UTC, que é outro em fuso negativo. */
const localDay = (iso: string): string =>
  new Date(iso).toLocaleDateString('sv-SE')

describe('rangeOf', () => {
  it('covers only the current day for today', () => {
    const { from, to } = rangeOf('today')
    expect(localDay(from)).toBe(localDay(to))
  })

  it.each([
    ['week', 6],
    ['fortnight', 14],
    ['month', 29],
  ] as const)('walks back %s by %i days', (period, daysBack) => {
    const { from, to } = rangeOf(period)
    const days = Math.round(
      (new Date(localDay(to)).getTime() - new Date(localDay(from)).getTime()) /
        86_400_000
    )
    expect(days).toBe(daysBack)
  })
})

describe('customRange', () => {
  it('takes both days whole', () => {
    const range = customRange('2026-07-01', '2026-07-03')
    expect(range).not.toBeNull()
    expect(localDay(range!.from)).toBe('2026-07-01')
    expect(localDay(range!.to)).toBe('2026-07-03')
  })

  it('refuses a missing side', () => {
    expect(customRange('', '2026-07-03')).toBeNull()
    expect(customRange('2026-07-01', '')).toBeNull()
  })

  it('refuses an inverted range', () => {
    expect(customRange('2026-07-10', '2026-07-01')).toBeNull()
  })

  it(`accepts a window of exactly ${MAX_RANGE_MONTHS} months`, () => {
    expect(customRange('2026-01-01', '2026-07-01')).not.toBeNull()
  })

  it('refuses a window past the limit', () => {
    expect(customRange('2026-01-01', '2026-07-02')).toBeNull()
  })

  /* O mesmo caso que quebrou a validação da API: somar meses sem prender o
     dia faz 31 de agosto virar 3 de março e alarga a janela em silêncio. */
  it('clamps the day when the target month is shorter', () => {
    expect(customRange('2026-08-31', '2027-02-28')).not.toBeNull()
    expect(customRange('2026-08-31', '2027-03-01')).toBeNull()
  })
})
