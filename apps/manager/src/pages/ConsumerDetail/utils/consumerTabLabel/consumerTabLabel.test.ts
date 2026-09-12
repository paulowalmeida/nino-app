import { describe, expect, it } from 'vitest'

import { consumerTabLabel } from './consumerTabLabel'
import { consumerTabLabelMock } from './consumerTabLabel.mock'

describe('consumerTabLabel', () => {
  it('appends the counted amount to the tab name', () => {
    expect(
      consumerTabLabel(consumerTabLabelMock.name, consumerTabLabelMock.count)
    ).toBe('Pedidos · 12')
  })

  it('keeps the bare name when the amount is unknown', () => {
    expect(consumerTabLabel(consumerTabLabelMock.name, undefined)).toBe(
      'Pedidos'
    )
  })

  it('keeps a zero count visible', () => {
    expect(consumerTabLabel(consumerTabLabelMock.name, 0)).toBe('Pedidos · 0')
  })
})
