import { describe, expect, it, vi } from 'vitest'

import { apiMock } from './http.service.mock'

vi.mock('@services/http.service', () => ({ api: apiMock }))

const { AuthService } = await import('@services/auth.service')

describe('AuthService', () => {
  it('login: creates auth/login with the credentials', async () => {
    // Arrange
    const data = { email: 'weskley@nino.delivery', password: 'segredo123' }
    apiMock.create.mockResolvedValueOnce({ id: 'u1' })

    // Act
    const result = await AuthService.login(data)

    // Assert
    expect(apiMock.create).toHaveBeenCalledWith('auth/login', data)
    expect(result).toEqual({ id: 'u1' })
  })

  it('signup: creates auth/signup with the new account data', async () => {
    // Arrange
    const data = {
      account: {
        name: 'Weskley',
        email: 'weskley@nino.delivery',
        password: 'segredo123',
        cpf: '12345678900',
        phone: '11987654321',
      },
      company: { name: 'Burgão do Nino LTDA', cnpj: '12345678000199' },
    }
    apiMock.create.mockResolvedValueOnce({ id: 'u1' })

    // Act
    const result = await AuthService.signup(data)

    // Assert
    expect(apiMock.create).toHaveBeenCalledWith('auth/signup', data)
    expect(result).toEqual({ id: 'u1' })
  })

  it('checkAvailability: creates auth/check-availability with the field', async () => {
    // Arrange
    const data = { email: 'weskley@nino.delivery' }
    apiMock.create.mockResolvedValueOnce({ available: true })

    // Act
    const result = await AuthService.checkAvailability(data)

    // Assert
    expect(apiMock.create).toHaveBeenCalledWith(
      'auth/check-availability',
      data
    )
    expect(result).toEqual({ available: true })
  })

  it('me: reads GET auth/me', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ id: 'u1', memberships: [] })

    // Act
    const result = await AuthService.me()

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith('auth/me')
    expect(result).toEqual({ id: 'u1', memberships: [] })
  })

  it('logout: creates auth/logout with no body', async () => {
    // Arrange / Act
    await AuthService.logout()

    // Assert
    expect(apiMock.create).toHaveBeenCalledWith('auth/logout')
  })

  it('propagates the error when the request fails', async () => {
    // Arrange
    apiMock.get.mockRejectedValueOnce(new Error('network error'))

    // Act / Assert
    await expect(AuthService.me()).rejects.toThrow('network error')
  })
})
