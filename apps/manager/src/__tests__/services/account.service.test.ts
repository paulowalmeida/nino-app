import { describe, expect, it, vi } from 'vitest'

import { apiMock } from './http.service.mock'

vi.mock('@services/http.service', () => ({ api: apiMock }))

const { AccountService } = await import('@services/account.service')

describe('AccountService', () => {
  it('getProfile: reads GET my/profile', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ id: 'u1' })

    // Act
    const result = await AccountService.getProfile()

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith('my/profile')
    expect(result).toEqual({ id: 'u1' })
  })

  it('updateProfile: patches my/profile with the given data', async () => {
    // Arrange
    apiMock.patch.mockResolvedValueOnce({ id: 'u1', name: 'Weskley' })

    // Act
    const result = await AccountService.updateProfile({ name: 'Weskley' })

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith('my/profile', {
      name: 'Weskley',
    })
    expect(result).toEqual({ id: 'u1', name: 'Weskley' })
  })

  it('updateMyEmail: patches my/profile/email with the given email', async () => {
    // Arrange / Act
    await AccountService.updateMyEmail('novo@nino.delivery')

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith('my/profile/email', {
      email: 'novo@nino.delivery',
    })
  })

  it('getSubscription: reads GET my/subscription', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ plan: 'PRO' })

    // Act
    const result = await AccountService.getSubscription()

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith('my/subscription')
    expect(result).toEqual({ plan: 'PRO' })
  })

  it('propagates the error when the request fails', async () => {
    // Arrange
    apiMock.get.mockRejectedValueOnce(new Error('network error'))

    // Act / Assert
    await expect(AccountService.getProfile()).rejects.toThrow(
      'network error'
    )
  })
})
