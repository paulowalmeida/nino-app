import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { ProfileService } from './profile.service'
import {
  credentialInfoMock,
  profileMock,
  updateProfileRequestMock,
} from './profile.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('ProfileService', () => {
  afterEach(() => vi.clearAllMocks())

  it('getProfile: reads my/profile', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(profileMock)

    // Act
    const result = await ProfileService.getProfile()

    // Assert
    expect(api.get).toHaveBeenCalledWith('my/profile')
    expect(result).toBe(profileMock)
  })

  it('updateProfile: patches my/profile with the given data', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(profileMock)

    // Act
    const result = await ProfileService.updateProfile(updateProfileRequestMock)

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      'my/profile',
      updateProfileRequestMock
    )
    expect(result).toBe(profileMock)
  })

  it('updateMyEmail: patches my/profile/email with the new email', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(credentialInfoMock)

    // Act
    const result = await ProfileService.updateMyEmail('novo@padoca.com')

    // Assert
    expect(api.patch).toHaveBeenCalledWith('my/profile/email', {
      email: 'novo@padoca.com',
    })
    expect(result).toBe(credentialInfoMock)
  })
})
