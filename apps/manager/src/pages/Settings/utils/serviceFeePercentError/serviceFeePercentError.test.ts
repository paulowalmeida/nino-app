import { describe, expect, it } from 'vitest'

import {
  serviceFeePercentError,
  serviceFeePercentValue,
} from './serviceFeePercentError'
import { serviceFeePercentErrorMock } from './serviceFeePercentError.mock'

describe('serviceFeePercentError', () => {
  it('accepts the usual 10% and a decimal comma', () => {
    expect(
      serviceFeePercentError(serviceFeePercentErrorMock.usualPercent)
    ).toBeUndefined()
    expect(
      serviceFeePercentValue(serviceFeePercentErrorMock.decimalPercent)
    ).toBe(12.5)
  })

  it('refuses a fee above 20%', () => {
    expect(
      serviceFeePercentError(serviceFeePercentErrorMock.abovePercent)
    ).toBe('A taxa vai até 20%.')
  })

  it('asks for a percent when the field is blank or not a number', () => {
    expect(
      serviceFeePercentError(serviceFeePercentErrorMock.blankPercent)
    ).toBe('Informe a porcentagem da taxa.')
    expect(serviceFeePercentError(serviceFeePercentErrorMock.textPercent)).toBe(
      'Informe a porcentagem da taxa.'
    )
  })
})
