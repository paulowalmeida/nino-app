import { describe, expect, it } from 'vitest'

import { changeDue } from './change-due'
import { changeDueCasesMock, changeDueTotalMock } from './change-due.mock'

describe(changeDue.name, () => {
  it('resolves every received amount against the sale total', () => {
    changeDueCasesMock.forEach(({ received, hasChange, isValid, amount }) => {
      expect(changeDue(received, changeDueTotalMock)).toEqual({
        hasChange,
        isValid,
        amount: expect.closeTo(amount, 2),
      })
    })
  })

  it('treats no received amount as an exact payment', () => {
    expect(changeDue(null, changeDueTotalMock)).toEqual({
      hasChange: false,
      isValid: true,
      amount: 0,
    })
  })

  it('owes nothing on a free sale', () => {
    expect(changeDue(10, 0)).toEqual({
      hasChange: true,
      isValid: true,
      amount: 10,
    })
  })
})
