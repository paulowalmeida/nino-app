import { describe, expect, it, vi } from 'vitest'

import { changeProfileForm } from './change-profile-form'
import { changeProfileFormOperationMock } from './change-profile-form.mock'

describe(changeProfileForm.name, () => {
  it('marks the draft dirty', () => {
    const set = vi.fn()
    changeProfileForm(set, changeProfileFormOperationMock)
    expect(set).toHaveBeenCalled()
  })
})
