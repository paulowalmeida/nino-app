import { describe, expect, it } from 'vitest'

import { tabPaymentRequest } from './tabPaymentRequest'
import { tabPaymentRequestMock } from './tabPaymentRequest.mock'

describe('tabPaymentRequest', () => {
  it('carries the part of the bill and the received amount for cash', () => {
    expect(
      tabPaymentRequest(
        'CASH',
        tabPaymentRequestMock.amountText,
        tabPaymentRequestMock.receivedAmountText
      )
    ).toEqual({ method: 'CASH', amount: 18, amountReceived: 50 })
  })

  it('assumes the exact amount when cash has no received amount', () => {
    expect(
      tabPaymentRequest(
        'CASH',
        tabPaymentRequestMock.amountText,
        tabPaymentRequestMock.blankAmountText
      )
    ).toEqual({ method: 'CASH', amount: 18 })
  })

  it('ignores a typed received amount for methods that give no change', () => {
    expect(
      tabPaymentRequest(
        'PIX',
        tabPaymentRequestMock.amountText,
        tabPaymentRequestMock.receivedAmountText
      )
    ).toEqual({ method: 'PIX', amount: 18 })
  })
})
