import { describe, expect, it } from 'vitest'

import { consumerFirstName } from './consumerFirstName'
import { consumerFirstNameMock } from './consumerFirstName.mock'

describe('consumerFirstName', () => {
  it('takes the first word of a padded full name', () => {
    expect(consumerFirstName(consumerFirstNameMock.fullName)).toBe('Maria')
  })

  it('keeps a single-word name intact', () => {
    expect(consumerFirstName(consumerFirstNameMock.singleName)).toBe('Maria')
  })
})
