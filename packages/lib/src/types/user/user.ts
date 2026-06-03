import { GlobalRole } from '../../enums'
import { CredentialInfo } from './credential-info'

export type User = {
  id: string
  name: string
  phone: string | null
  isActive: boolean
  lastLoginAt: string | null
  locale: string | null
  timezone: string | null
  companyId: string | null
  createdAt: string
  updatedAt: string
  role: { id: string; name: GlobalRole }
  credentials: CredentialInfo[]
}
