import { describe, expect, it, vi } from 'vitest'

import { setSheet } from './set-sheet'

describe(setSheet.name, () => {
  it('sets drawer visibility', () => {
    const set = vi.fn()
    setSheet(set, true)
    expect(set).toHaveBeenCalledWith({ sheet: true })
  })
})
