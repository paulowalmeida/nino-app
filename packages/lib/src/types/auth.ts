import { GlobalRole } from '../enums'
import { User } from './user'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  globalRole: GlobalRole
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}

export interface LoginResponse {
  user: User
  tokens: Tokens
}
