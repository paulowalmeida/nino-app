import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { AuthService } from './auth.service'
import {
  authUserMock,
  checkAvailabilityRequestMock,
  checkAvailabilityResponseMock,
  forgotPasswordRequestMock,
  loginRequestMock,
  meResponseMock,
  messageResponseMock,
  resetPasswordRequestMock,
  signupRequestMock,
} from './auth.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    create: vi.fn(),
  },
}))

describe('AuthService', () => {
  afterEach(() => vi.clearAllMocks())

  it('login: posts credentials to auth/login', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(authUserMock)

    // Act
    const result = await AuthService.login(loginRequestMock)

    // Assert
    expect(api.create).toHaveBeenCalledWith('auth/login', loginRequestMock)
    expect(result).toBe(authUserMock)
  })

  it('signup: posts the new account to auth/signup', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(authUserMock)

    // Act
    const result = await AuthService.signup(signupRequestMock)

    // Assert
    expect(api.create).toHaveBeenCalledWith('auth/signup', signupRequestMock)
    expect(result).toBe(authUserMock)
  })

  it('checkAvailability: posts to auth/check-availability', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(checkAvailabilityResponseMock)

    // Act
    const result = await AuthService.checkAvailability(
      checkAvailabilityRequestMock
    )

    // Assert
    expect(api.create).toHaveBeenCalledWith(
      'auth/check-availability',
      checkAvailabilityRequestMock
    )
    expect(result).toBe(checkAvailabilityResponseMock)
  })

  it('me: reads auth/me and resolves the current session', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(meResponseMock)

    // Act
    const result = await AuthService.me()

    // Assert
    expect(api.get).toHaveBeenCalledWith('auth/me')
    expect(result).toBe(meResponseMock)
  })

  it('logout: posts to auth/logout with no body', async () => {
    // Act
    await AuthService.logout()

    // Assert
    expect(api.create).toHaveBeenCalledWith('auth/logout')
  })

  it('forgotPassword: posts the email to auth/forgot-password', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(messageResponseMock)

    // Act
    const result = await AuthService.forgotPassword(forgotPasswordRequestMock)

    // Assert
    expect(api.create).toHaveBeenCalledWith(
      'auth/forgot-password',
      forgotPasswordRequestMock
    )
    expect(result).toBe(messageResponseMock)
  })

  it('resetPassword: posts the token and new password to auth/reset-password', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(messageResponseMock)

    // Act
    const result = await AuthService.resetPassword(resetPasswordRequestMock)

    // Assert
    expect(api.create).toHaveBeenCalledWith(
      'auth/reset-password',
      resetPasswordRequestMock
    )
    expect(result).toBe(messageResponseMock)
  })
})
