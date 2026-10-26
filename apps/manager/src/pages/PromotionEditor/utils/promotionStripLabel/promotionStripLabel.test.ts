import { describe, expect, it } from 'vitest'

import { promotionStripLabel } from './promotionStripLabel'
import { stripPartsMock } from './promotionStripLabel.mock'

describe(promotionStripLabel.name, () => {
  it('appends the end date the customer sees', () => {
    expect(promotionStripLabel(stripPartsMock)).toBe(
      'Frete grátis acima de R$ 60,00 · até 30/11'
    )
  })

  it('leaves out a future start and an open end', () => {
    expect(
      promotionStripLabel({ ...stripPartsMock, period: 'a partir de 01/12' })
    ).toBe(stripPartsMock.headline)
    expect(promotionStripLabel({ ...stripPartsMock, period: null })).toBe(
      stripPartsMock.headline
    )
  })
})
