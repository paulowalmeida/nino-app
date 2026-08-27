import type { CredentialInfo } from '@shared/types/profile/credential-info'

export type AuthUser = {
  id: string
  name: string
  timezone?: string | null
  phone?: string | null
  locale?: string | null
  createdAt?: string
  lastLoginAt?: string | null
  credentials?: CredentialInfo[]
}
