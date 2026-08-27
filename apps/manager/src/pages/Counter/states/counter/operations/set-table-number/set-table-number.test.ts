import { describe, expect, it, vi } from 'vitest'

import { setTableNumber } from './set-table-number'

describe(setTableNumber.name, () => {
  it('sets the table number', () => {
    const set = vi.fn()
    setTableNumber(set, '4')
    expect(set).toHaveBeenCalledWith({ tableNumber: '4' })
  })
})
