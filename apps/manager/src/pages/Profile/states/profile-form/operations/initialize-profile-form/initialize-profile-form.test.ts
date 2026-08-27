import { describe, expect, it, vi } from 'vitest'

import { initializeProfileForm } from './initialize-profile-form'

describe(initializeProfileForm.name, () => {
  it('initializes the editable draft', () => {
    const set = vi.fn()
    const get = vi.fn().mockReturnValue({ isDirty: false, initializedProfileId: null })

    initializeProfileForm(set, get, {
      id: 'profile-1', name: 'Maria', phone: null, credentials: [],
    } as never)

    expect(set).toHaveBeenCalledWith(expect.objectContaining({ initializedProfileId: 'profile-1' }))
  })
})
