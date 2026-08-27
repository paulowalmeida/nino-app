import { api } from '@shared/services/http/http.service'
import type { AuthUser } from '@shared/types/auth/auth-user'
import type { CheckAvailabilityRequest } from '@shared/types/auth/check-availability-request'
import type { CheckAvailabilityResponse } from '@shared/types/auth/check-availability-response'
import type { LoginRequest } from '@shared/types/auth/login-request'
import type { Membership } from '@shared/types/auth/membership'
import type { SignupRequest } from '@shared/types/auth/signup-request'

type MeResponse = AuthUser & {
  memberships: Membership[]
}

export const AuthService = {
  login: (data: LoginRequest): Promise<AuthUser> =>
    api.create<LoginRequest, AuthUser>('auth/login', data),

  signup: (data: SignupRequest): Promise<AuthUser> =>
    api.create<SignupRequest, AuthUser>('auth/signup', data),

  checkAvailability: (
    data: CheckAvailabilityRequest
  ): Promise<CheckAvailabilityResponse> =>
    api.create<CheckAvailabilityRequest, CheckAvailabilityResponse>(
      'auth/check-availability',
      data
    ),

  me: (): Promise<MeResponse> => api.get<MeResponse>('auth/me'),

  logout: (): Promise<void> => api.create<void, void>('auth/logout'),
}
