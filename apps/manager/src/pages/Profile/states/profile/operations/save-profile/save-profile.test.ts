import { describe, expect, it, vi } from 'vitest'

import { ProfileService } from '@pages/Profile/services/profile/profile.service'

import { saveProfile } from './save-profile'
import { saveProfileOperationMock } from './save-profile.mock'

vi.mock('@pages/Profile/services/profile/profile.service')

describe(saveProfile.name, () => {
  it('saves and publishes the updated profile', async () => {
    const profile = { id: 'profile-1' } as never
    vi.mocked(ProfileService.updateProfile).mockResolvedValue(profile)
    const set = vi.fn()

    await expect(saveProfile(set, saveProfileOperationMock)).resolves.toBe(
      profile
    )
    expect(set).toHaveBeenCalledWith({
      profile,
      status: 'success',
      isSaving: false,
    })
  })
})
