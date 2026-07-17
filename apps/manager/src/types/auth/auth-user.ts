import type { CredentialInfo } from './credential-info'

export type AuthUser = {
  id: string
  name: string
  phone: string | null
  isActive: boolean
  lastLoginAt: string | null
  profileCompletedAt: string | null
  locale: string | null
  timezone: string | null
  createdAt: string
  updatedAt: string
  credentials: CredentialInfo[]
  companyId?: string | null
}
