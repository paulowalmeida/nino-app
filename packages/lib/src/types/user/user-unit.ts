import { UnitRole } from '../../enums'
import { User } from './user'

export type UserUnit = {
  id: string
  unitId: string
  createdAt: string
  updatedAt: string
  unitRole: { id: string; name: UnitRole }
  user: User
}
