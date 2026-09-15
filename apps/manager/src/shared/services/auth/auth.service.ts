import { api } from '@shared/services/http/http.service'
import type { AuthUser } from '@shared/types/auth/auth-user'
import type { CheckAvailabilityRequest } from '@shared/types/auth/check-availability-request'
import type { CheckAvailabilityResponse } from '@shared/types/auth/check-availability-response'
import type { ForgotPasswordRequest } from '@shared/types/auth/forgot-password-request.type'
import type { LoginRequest } from '@shared/types/auth/login-request'
import type { Membership } from '@shared/types/auth/membership'
import type { MessageResponse } from '@shared/types/auth/message-response.type'
import type { ResetPasswordRequest } from '@shared/types/auth/reset-password-request.type'
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

  logout: (): Promise<void> => api.create<void, void>('session-manager/logout'),

  forgotPassword: (data: ForgotPasswordRequest): Promise<MessageResponse> =>
    api.create<ForgotPasswordRequest, MessageResponse>(
      'auth/forgot-password',
      data
    ),

  resetPassword: (data: ResetPasswordRequest): Promise<MessageResponse> =>
    api.create<ResetPasswordRequest, MessageResponse>(
      'auth/reset-password',
      data
    ),
}
