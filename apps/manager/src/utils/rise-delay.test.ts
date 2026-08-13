import { describe, expect, it } from 'vitest'

import { riseDelay } from './rise-delay'

describe('riseDelay', () => {
  it('writes the delay in milliseconds to --d', () => {
    expect(riseDelay(240)).toEqual({ '--d': '240ms' })
  })

  it('writes zero when the block opens the screen', () => {
    expect(riseDelay(0)).toEqual({ '--d': '0ms' })
  })

  it('writes a negative delay as-is, without clamping it', () => {
    expect(riseDelay(-50)).toEqual({ '--d': '-50ms' })
  })
})
