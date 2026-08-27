import { describe, expect, it } from 'vitest'

import { elapsedVar } from './elapsed-var'

describe('elapsedVar', () => {
  it('exposes the ratio through the --t custom property', () => {
    expect(elapsedVar(0.4)).toEqual({ '--t': 0.4 })
  })
})
