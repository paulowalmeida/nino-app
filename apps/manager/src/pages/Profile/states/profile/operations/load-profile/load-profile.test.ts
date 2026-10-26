import { describe, expect, it, vi } from 'vitest'

import { ProfileService } from '@pages/Profile/services/profile/profile.service'

import { loadProfile } from './load-profile'

vi.mock('@pages/Profile/services/profile/profile.service')

describe(loadProfile.name, () => {
  it('loads and stores the profile', async () => {
    const profile = { id: 'profile-1' } as never
    vi.mocked(ProfileService.getProfile).mockResolvedValue(profile)
    const set = vi.fn()
    const get = vi.fn().mockReturnValue({ status: 'idle', profile: null })

    await loadProfile(set, get)

    expect(set).toHaveBeenCalledWith({
      status: 'success',
      profile,
      error: null,
    })
  })
})
