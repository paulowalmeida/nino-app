import { del, get, post } from '@nino/lib'
import type { LoginRequest, LoginResponse, User } from '@nino/lib'

import { getCookie, removeCookie, setCookie } from '@/lib/cookies'
import { httpConfig } from '@/lib/http'

const ACCESS_TOKEN_MAX_AGE = 15 * 60
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60

export function setTokens(accessToken: string, refreshToken: string): void {
  setCookie('accessToken', accessToken, ACCESS_TOKEN_MAX_AGE)
  setCookie('refreshToken', refreshToken, REFRESH_TOKEN_MAX_AGE)
}

export function clearTokens(): void {
  removeCookie('accessToken')
  removeCookie('refreshToken')
}

export function login(data: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>(httpConfig(), '/auth/login', data)
}

export function logout(): Promise<void> {
  return del<void>(httpConfig(() => getCookie('refreshToken')), '/auth/logout')
}

export function me(): Promise<User> {
  return get<User>(httpConfig(() => getCookie('accessToken')), '/auth/me')
}
