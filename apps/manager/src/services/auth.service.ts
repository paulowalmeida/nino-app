import type {
  AuthUser,
  CheckAvailabilityRequest,
  CheckAvailabilityResponse,
  LoginRequest,
  Membership,
  SignupRequest,
} from '@custom_types/auth'
import { api } from '@services/http.service'

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
