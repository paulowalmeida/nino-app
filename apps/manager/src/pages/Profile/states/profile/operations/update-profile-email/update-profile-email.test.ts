import { describe, expect, it, vi } from 'vitest'

import { ProfileService } from '@pages/Profile/services/profile/profile.service'

import { updateProfileEmail } from './update-profile-email'
import { updateProfileEmailOperationMock } from './update-profile-email.mock'

vi.mock('@pages/Profile/services/profile/profile.service')

describe(updateProfileEmail.name, () => {
  it('updates the first credential in the profile', async () => {
    const credential = { email: updateProfileEmailOperationMock.email } as never
    vi.mocked(ProfileService.updateMyEmail).mockResolvedValue(credential)
    const set = vi.fn()
    const get = vi.fn().mockReturnValue({
      profile: { credentials: [{ email: 'old@example.com' }] },
    })

    await updateProfileEmail(set, get, updateProfileEmailOperationMock.email)

    expect(set).toHaveBeenLastCalledWith(expect.objectContaining({ isUpdatingEmail: false }))
  })
})
