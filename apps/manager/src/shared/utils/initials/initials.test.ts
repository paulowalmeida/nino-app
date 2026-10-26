import { describe, expect, it } from 'vitest'

import { initialsOf } from './initials'

describe('initialsOf', () => {
  it('takes the first letter of the first two words', () => {
    expect(initialsOf('Ana Beatriz Silva')).toBe('AB')
  })

  it('uses the single available letter for a one-word name', () => {
    expect(initialsOf('Ana')).toBe('A')
  })

  it('returns an empty string for an empty name', () => {
    expect(initialsOf('')).toBe('')
  })
})
