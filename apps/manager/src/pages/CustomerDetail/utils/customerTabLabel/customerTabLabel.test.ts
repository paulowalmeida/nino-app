import { describe, expect, it } from 'vitest'

import { customerTabLabel } from './customerTabLabel'
import { customerTabLabelMock } from './customerTabLabel.mock'

describe('customerTabLabel', () => {
  it('appends the counted amount to the tab name', () => {
    expect(
      customerTabLabel(customerTabLabelMock.name, customerTabLabelMock.count)
    ).toBe('Pedidos · 12')
  })

  it('keeps the bare name when the amount is unknown', () => {
    expect(customerTabLabel(customerTabLabelMock.name, undefined)).toBe(
      'Pedidos'
    )
  })

  it('keeps a zero count visible', () => {
    expect(customerTabLabel(customerTabLabelMock.name, 0)).toBe('Pedidos · 0')
  })
})
