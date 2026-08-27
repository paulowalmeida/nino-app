import { describe, expect, it } from 'vitest'

import { saveProfileForm } from './save-profile-form'

describe(saveProfileForm.name, () => {
  it('is an async store transition', () => {
    expect(saveProfileForm).toBeTypeOf('function')
  })
})
