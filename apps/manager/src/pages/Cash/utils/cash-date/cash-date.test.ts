import { describe, expect, it } from 'vitest'

import { dateToKey, parseKey, todayKey } from './cash-date'
import { sampleDate, sampleKey } from './cash-date.mock'

describe('cash-date', () => {
  it('dateToKey formats a Date as its local YYYY-MM-DD key', () => {
    expect(dateToKey(sampleDate)).toBe(sampleKey)
  })

  it('parseKey turns a YYYY-MM-DD key back into local midnight', () => {
    const parsed = parseKey(sampleKey)

    expect(parsed.getFullYear()).toBe(2026)
    expect(parsed.getMonth()).toBe(7)
    expect(parsed.getDate()).toBe(29)
    expect(parsed.getHours()).toBe(0)
  })

  it('todayKey matches converting the current date', () => {
    expect(todayKey()).toBe(dateToKey(new Date()))
  })
})
