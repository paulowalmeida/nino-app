import type {
  AuthUser,
  CheckAvailabilityRequest,
  CheckAvailabilityResponse,
  LoginRequest,
  SignupRequest,
} from '@custom_types/auth'
import { ApiFactory } from '@services/api/api.service'

const { get, create } = ApiFactory()

export const login = (data: LoginRequest): Promise<AuthUser> =>
  create<LoginRequest, AuthUser>('auth/login', data)

export const signup = (data: SignupRequest): Promise<AuthUser> =>
  create<SignupRequest, AuthUser>('auth/signup', data)

export const checkAvailability = (
  data: CheckAvailabilityRequest
): Promise<CheckAvailabilityResponse> =>
  create<CheckAvailabilityRequest, CheckAvailabilityResponse>(
    'auth/check-availability',
    data
  )

export const me = (): Promise<AuthUser> => get<AuthUser>('auth/me')

export const logout = (): Promise<void> => create<void, void>('auth/logout')
