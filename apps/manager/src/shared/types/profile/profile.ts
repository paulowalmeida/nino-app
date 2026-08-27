import type { CredentialInfo } from './credential-info'

export type Profile = {
  id: string
  name: string
  email?: string
  phone: string | null
  locale: string | null
  timezone: string | null
  createdAt: string
  lastLoginAt: string | null
  credentials: CredentialInfo[]
}
