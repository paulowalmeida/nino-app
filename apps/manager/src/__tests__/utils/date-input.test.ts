import { describe, expect, it } from 'vitest'

import { dateToInput, parseInputDate, todayInput } from '@utils/date-input'

describe('date-input', () => {
  it('round-trips a day through Date and back', () => {
    expect(dateToInput(parseInputDate('2026-07-15'))).toBe('2026-07-15')
  })

  /* `toISOString().slice(0, 10)` devolveria o dia seguinte à noite em fuso
     negativo — o campo mostra dia local, não UTC. */
  it('keeps the local day at the end of the day', () => {
    const lateNight = new Date(2026, 6, 15, 23, 30)
    expect(dateToInput(lateNight)).toBe('2026-07-15')
  })

  it('parses to local midnight, not UTC', () => {
    const parsed = parseInputDate('2026-07-15')
    expect(parsed.getHours()).toBe(0)
    expect(parsed.getDate()).toBe(15)
  })

  it('reports today in the same shape the fields use', () => {
    expect(todayInput()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(todayInput()).toBe(dateToInput(new Date()))
  })
})
