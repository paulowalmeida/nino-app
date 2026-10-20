import { describe, expect, it } from 'vitest'

import { tabPaymentAmountError } from './tabPaymentAmountError'
import { tabPaymentAmountErrorMock } from './tabPaymentAmountError.mock'

const { remainingAmount } = tabPaymentAmountErrorMock

describe('tabPaymentAmountError', () => {
  it('accepts part of what is left and the whole remainder', () => {
    expect(
      tabPaymentAmountError(
        tabPaymentAmountErrorMock.partialAmount,
        remainingAmount
      )
    ).toBeUndefined()
    expect(
      tabPaymentAmountError(remainingAmount, remainingAmount)
    ).toBeUndefined()
  })

  it('refuses more than what is left', () => {
    expect(
      tabPaymentAmountError(
        tabPaymentAmountErrorMock.aboveRemainingAmount,
        remainingAmount
      )
    ).toBe('Passa do que falta pagar.')
  })

  it('asks for an amount when it is zero or unreadable', () => {
    expect(tabPaymentAmountError(0, remainingAmount)).toBe(
      'Informe quanto será pago agora.'
    )
    expect(
      tabPaymentAmountError(
        tabPaymentAmountErrorMock.invalidAmount,
        remainingAmount
      )
    ).toBe('Informe quanto será pago agora.')
  })
})
