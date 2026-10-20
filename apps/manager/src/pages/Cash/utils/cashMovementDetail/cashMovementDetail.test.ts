import { describe, expect, it } from 'vitest'

import { cashMovementDetail } from './cashMovementDetail'
import { cashMovementDetailMock } from './cashMovementDetail.mock'

describe('cashMovementDetail', () => {
  it('names the counter order behind a cash sale', () => {
    expect(cashMovementDetail(cashMovementDetailMock.counterSale)).toBe(
      'Pedido #123'
    )
  })

  it('names the tab behind a cash payment', () => {
    expect(cashMovementDetail(cashMovementDetailMock.tabSale)).toBe(
      'Comanda Mesa 4'
    )
  })

  it('keeps the reason typed for a withdrawal or deposit', () => {
    expect(cashMovementDetail(cashMovementDetailMock.withdrawal)).toBe(
      'Troco pro motoboy'
    )
  })

  it('shows a dash when the origin is unknown', () => {
    expect(cashMovementDetail(cashMovementDetailMock.unknownSale)).toBe('—')
  })
})
