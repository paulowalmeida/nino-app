import type { LoginRequest } from '@shared/types/auth/login-request'

export const loginCredentialsMock: LoginRequest = {
  email: 'ana@example.com',
  password: 'senha-segura',
}

export const loginFailureMessageMock = 'E-mail ou senha não conferem.'
