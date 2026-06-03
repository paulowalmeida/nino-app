import { TenantRole } from '../../enums'
import { User } from './user'

export type UserTenant = {
  id: string
  tenantId: string
  createdAt: string
  updatedAt: string
  tenantRole: { id: string; name: TenantRole }
  user: User
}
