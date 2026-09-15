import { describe, expect, it } from 'vitest'

import { formatPhone, toE164 } from './phone'

describe('phone', () => {
  it('formatPhone reads a mobile number the way someone speaks it', () => {
    expect(formatPhone('+5591999990000')).toBe('(91) 99999-0000')
  })

  it('formatPhone reads a landline number', () => {
    expect(formatPhone('+559130000000')).toBe('(91) 3000-0000')
  })

  it('formatPhone leaves an unrecognized value untouched', () => {
    expect(formatPhone('123')).toBe('123')
  })

  it('toE164 adds the country code to bare digits', () => {
    expect(toE164('91999990000')).toBe('+5591999990000')
  })

  it('toE164 keeps a number that already carries the country code', () => {
    expect(toE164('+5591999990000')).toBe('+5591999990000')
  })

  it('keeps DDD 55 when the number is entered without the country code', () => {
    expect(toE164('55999990000')).toBe('+5555999990000')
    expect(formatPhone('55999990000')).toBe('(55) 99999-0000')
  })

  it('toE164 returns an empty string when there is nothing to dial', () => {
    expect(toE164('')).toBe('')
  })
})
