import { User } from '../user/user'

export type CourierTenant = {
  id: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  courier: User
  tenant: {
    id: string
    slug: string
    customName: string | null
    logoUrl: string | null
    city: string
    state: string
  }
}
