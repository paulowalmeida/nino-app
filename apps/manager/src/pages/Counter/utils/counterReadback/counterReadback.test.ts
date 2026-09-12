import { describe, expect, it } from 'vitest'

import { brl } from '@shared/utils/money/money'

import { counterReadback } from './counterReadback'
import {
  counterReadbackCashMock,
  counterReadbackLocalMock,
} from './counterReadback.mock'

describe(counterReadback.name, () => {
  it('reads a local order back with table and name', () => {
    expect(counterReadback(counterReadbackLocalMock)).toBe(
      'No local, mesa 12, para Ana. Paga com Pix.'
    )
  })

  it('falls back to the consumer and announces the change', () => {
    expect(counterReadback(counterReadbackCashMock)).toBe(
      `Retirada no balcão para o cliente. Paga com dinheiro, troco de ${brl(10)}.`
    )
  })

  it('reads the address for a delivery', () => {
    expect(
      counterReadback({
        ...counterReadbackLocalMock,
        channel: 'DELIVERY',
        addressLine: 'Rua Ó de Almeida, 42',
      })
    ).toBe('Entrega para Ana, na Rua Ó de Almeida, 42. Paga com Pix.')
  })
})
