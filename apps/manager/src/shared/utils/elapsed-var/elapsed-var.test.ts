import { describe, expect, it } from 'vitest'

import { elapsedVar } from './elapsed-var'

describe('elapsedVar', () => {
  it('exposes the ratio through the --t custom property', () => {
    expect(elapsedVar(0.4)).toEqual({ '--t': 0.4, '--o': 0 })
  })

  it('exposes how far past the deadline the order is', () => {
    expect(elapsedVar(1, 0.25)).toEqual({ '--t': 1, '--o': 0.25 })
  })
})
