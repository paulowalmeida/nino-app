import { removeCookie } from "@lib/cookies"
import { httpConfig } from "@lib/http"

import type {
  CheckAvailabilityRequest,
  CheckAvailabilityResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  SignupRequest,
  User,
} from "@nino/lib"
import { get, post } from "@nino/lib"

export function clearTokens(): void {
  removeCookie("accessToken")
  removeCookie("refreshToken")
}

export function login(data: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>(httpConfig(), "/auth/login", data)
}

export function register(data: RegisterRequest): Promise<{ user: User }> {
  return post<{ user: User }>(httpConfig(), "/auth/register", data)
}

export function signup(data: SignupRequest): Promise<LoginResponse> {
  return post<LoginResponse>(httpConfig(), "/auth/signup", data)
}

export function checkAvailability(
  data: CheckAvailabilityRequest,
): Promise<CheckAvailabilityResponse> {
  return post<CheckAvailabilityResponse>(
    httpConfig(),
    "/auth/check-availability",
    data,
  )
}

export function logout(): Promise<void> {
  return post<void>(httpConfig(), "/auth/logout")
}

export function me(): Promise<User> {
  return get<User>(httpConfig(), "/auth/me")
}
