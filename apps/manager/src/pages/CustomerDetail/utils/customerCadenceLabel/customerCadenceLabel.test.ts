import { describe, expect, it } from 'vitest'

import { customerCadenceLabel } from './customerCadenceLabel'
import { customerCadenceLabelMock } from './customerCadenceLabel.mock'

describe('customerCadenceLabel', () => {
  it('joins the signup month with the last order recency', () => {
    const label = customerCadenceLabel(
      customerCadenceLabelMock.since,
      new Date().toISOString()
    )

    expect(label).toContain('Cliente desde')
    expect(label).toContain('pediu hoje')
  })

  it('states the absence of orders when there is no last order', () => {
    const label = customerCadenceLabel(
      customerCadenceLabelMock.since,
      customerCadenceLabelMock.lastOrderAt
    )

    expect(label).toContain('ainda sem pedido aqui')
  })
})
