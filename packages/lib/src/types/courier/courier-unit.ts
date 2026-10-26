import { User } from '../user/user'

export type CourierUnit = {
  id: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  courier: User
  unit: {
    id: string
    slug: string
    customName: string | null
    logoUrl: string | null
    city: string
    state: string
  }
}
