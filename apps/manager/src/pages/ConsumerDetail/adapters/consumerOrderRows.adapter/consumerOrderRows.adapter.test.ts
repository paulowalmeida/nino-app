import { describe, expect, it } from 'vitest'

import { toConsumerOrderRows } from './consumerOrderRows.adapter'
import { consumerOrderEntriesMock } from './consumerOrderRows.adapter.mock'

describe('toConsumerOrderRows', () => {
  it('converts history entries into presentation rows', () => {
    const [pending, cancelled] = toConsumerOrderRows(consumerOrderEntriesMock)

    expect(pending.href).toBe('../../pedidos/order-9f3a2b7c')
    expect(pending.number).toBe('1042')
    expect(pending.statusLabel).toBe('esperando aceite')
    expect(pending.statusVariant).toBe('brand')
    expect(pending.total).toMatch(/^R\$\s89,90$/)
    expect(pending.createdAt).toBe('2026-02-10T18:30:00.000Z')
    expect(pending.createdAtLabel).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    expect(cancelled.statusVariant).toBe('error')
  })

  it('returns no rows for an empty history', () => {
    expect(toConsumerOrderRows([])).toEqual([])
  })
})
