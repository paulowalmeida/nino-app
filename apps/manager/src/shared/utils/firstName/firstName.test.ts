import { describe, expect, it } from 'vitest'

import { firstName } from './firstName'
import { firstNameMock } from './firstName.mock'

describe('firstName', () => {
  it('greets by the first name alone', () => {
    expect(firstName(firstNameMock.fullName)).toBe(firstNameMock.first)
  })

  it('keeps a single name as it is', () => {
    expect(firstName(firstNameMock.singleName)).toBe(firstNameMock.first)
  })

  it('ignores the spaces around what was typed', () => {
    expect(firstName(firstNameMock.padded)).toBe(firstNameMock.first)
  })
})
