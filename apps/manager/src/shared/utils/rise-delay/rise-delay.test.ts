import { describe, expect, it } from 'vitest'

import { riseDelay } from './rise-delay'

describe('riseDelay', () => {
  it('exposes the delay through the --d custom property', () => {
    expect(riseDelay(120)).toEqual({ '--d': '120ms' })
  })
})
