import { describe, expect, it, vi } from 'vitest'

import { cancelDelete, requestDelete } from './delete-confirmation'
import { deleteConfirmationMock } from './delete-confirmation.mock'

describe('deleteConfirmation', () => {
  it('sets the address awaiting delete confirmation', () => {
    const set = vi.fn()

    requestDelete(set, deleteConfirmationMock.addressId)

    expect(set).toHaveBeenCalledWith({
      confirmingDeleteId: deleteConfirmationMock.addressId,
    })
  })

  it('clears the address awaiting delete confirmation', () => {
    const set = vi.fn()

    cancelDelete(set)

    expect(set).toHaveBeenCalledWith({ confirmingDeleteId: null })
  })
})
