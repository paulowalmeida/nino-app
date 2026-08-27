import { describe, expect, it } from 'vitest'

import { toCustomerRows } from './customerRows.adapter'
import { tenantCustomersMock } from './customerRows.adapter.mock'

describe('toCustomerRows', () => {
  it('converts customers into presentation rows', () => {
    const [maria] = toCustomerRows(tenantCustomersMock)

    expect(maria.id).toBe('customer-1')
    expect(maria.name).toBe('Maria Clara Souza')
    expect(maria.phoneLabel).toBe('(11) 98888-7777')
    expect(maria.spentLabel).toMatch(/^R\$\s890,50$/)
    expect(maria.ordersCount).toBe('12')
    expect(maria.pointsLabel).toBe('120')
    expect(maria.sinceLabel).toMatch(/24$/)
  })

  it('keeps the singular for a customer with one order', () => {
    const [maria, joao] = toCustomerRows(tenantCustomersMock)

    expect(maria.ordersLabel).toBe(' pedidos')
    expect(joao.ordersLabel).toBe(' pedido')
  })

  it('returns no rows for an empty base', () => {
    expect(toCustomerRows([])).toEqual([])
  })
})
