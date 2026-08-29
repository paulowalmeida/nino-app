import { describe, expect, it, vi } from 'vitest'

import { cancelEditing, startEditing } from './editing'
import { editingMock } from './editing.mock'

describe('editing', () => {
  it('sets the address being edited', () => {
    const set = vi.fn()

    startEditing(set, editingMock.addressId)

    expect(set).toHaveBeenCalledWith({ editingId: editingMock.addressId })
  })

  it('clears the address being edited', () => {
    const set = vi.fn()

    cancelEditing(set)

    expect(set).toHaveBeenCalledWith({ editingId: null })
  })
})
