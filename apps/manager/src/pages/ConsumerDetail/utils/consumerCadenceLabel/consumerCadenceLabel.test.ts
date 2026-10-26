import { describe, expect, it } from 'vitest'

import { consumerCadenceLabel } from './consumerCadenceLabel'
import { consumerCadenceLabelMock } from './consumerCadenceLabel.mock'

describe('consumerCadenceLabel', () => {
  it('joins the signup month with the last order recency', () => {
    const label = consumerCadenceLabel(
      consumerCadenceLabelMock.since,
      new Date().toISOString()
    )

    expect(label).toContain('Cliente desde')
    expect(label).toContain('pediu hoje')
  })

  it('states the absence of orders when there is no last order', () => {
    const label = consumerCadenceLabel(
      consumerCadenceLabelMock.since,
      consumerCadenceLabelMock.lastOrderAt
    )

    expect(label).toContain('ainda sem pedido aqui')
  })
})
