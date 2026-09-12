import { describe, expect, it } from 'vitest'

import { toConsumerRows } from './consumerRows.adapter'
import { tenantConsumersMock } from './consumerRows.adapter.mock'

describe('toConsumerRows', () => {
  it('converts consumers into presentation rows', () => {
    const [maria] = toConsumerRows(tenantConsumersMock)

    expect(maria.id).toBe('consumer-1')
    expect(maria.name).toBe('Maria Clara Souza')
    expect(maria.phoneLabel).toBe('(11) 98888-7777')
    expect(maria.spentLabel).toMatch(/^R\$\s890,50$/)
    expect(maria.ordersCount).toBe('12')
    expect(maria.pointsLabel).toBe('120')
    expect(maria.sinceLabel).toMatch(/24$/)
  })

  it('keeps the singular for a consumer with one order', () => {
    const [maria, joao] = toConsumerRows(tenantConsumersMock)

    expect(maria.ordersLabel).toBe(' pedidos')
    expect(joao.ordersLabel).toBe(' pedido')
  })

  it('returns no rows for an empty base', () => {
    expect(toConsumerRows([])).toEqual([])
  })
})
