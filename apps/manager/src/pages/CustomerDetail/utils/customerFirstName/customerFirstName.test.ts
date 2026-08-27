import { describe, expect, it } from 'vitest'

import { customerFirstName } from './customerFirstName'
import { customerFirstNameMock } from './customerFirstName.mock'

describe('customerFirstName', () => {
  it('takes the first word of a padded full name', () => {
    expect(customerFirstName(customerFirstNameMock.fullName)).toBe('Maria')
  })

  it('keeps a single-word name intact', () => {
    expect(customerFirstName(customerFirstNameMock.singleName)).toBe('Maria')
  })
})
