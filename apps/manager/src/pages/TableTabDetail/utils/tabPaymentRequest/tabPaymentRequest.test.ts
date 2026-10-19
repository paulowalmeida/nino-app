import { describe, expect, it } from 'vitest'

import { tabPaymentRequest } from './tabPaymentRequest'
import { tabPaymentRequestMock } from './tabPaymentRequest.mock'

describe('tabPaymentRequest', () => {
  it('carries the received amount for cash', () => {
    expect(
      tabPaymentRequest('CASH', tabPaymentRequestMock.receivedAmountText)
    ).toEqual({ method: 'CASH', amountReceived: 50 })
  })

  it('assumes the exact total when cash has no received amount', () => {
    expect(
      tabPaymentRequest('CASH', tabPaymentRequestMock.blankAmountText)
    ).toEqual({ method: 'CASH' })
  })

  it('ignores a typed amount for methods that give no change', () => {
    expect(
      tabPaymentRequest('PIX', tabPaymentRequestMock.receivedAmountText)
    ).toEqual({ method: 'PIX' })
  })
})
