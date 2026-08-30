import { describe, expect, it } from 'vitest'

import { toSaleReceipt } from './sale-receipt.adapter'
import { saleReceiptInputMock } from './sale-receipt.adapter.mock'

describe(toSaleReceipt.name, () => {
  it('carries the received amount and change for a cash sale', () => {
    expect(toSaleReceipt(saleReceiptInputMock)).toMatchObject({
      orderNumber: 128,
      total: 20,
      receivedAmount: 50,
      changeAmount: 30,
    })
  })

  it('records no change when cash was paid with the exact amount', () => {
    expect(
      toSaleReceipt({ ...saleReceiptInputMock, changeFor: '' })
    ).toMatchObject({ receivedAmount: null, changeAmount: 0 })
  })

  it('carries no received amount for a non-cash sale', () => {
    expect(
      toSaleReceipt({ ...saleReceiptInputMock, paymentMethod: 'PIX' })
    ).toMatchObject({ receivedAmount: null, changeAmount: 0 })
  })

  it('stamps the closing moment as an ISO string', () => {
    expect(toSaleReceipt(saleReceiptInputMock).closedAt).toBe(
      '2026-08-30T12:00:00.000Z'
    )
  })
})
