import { GlobalRole } from '../../enums'

export type RegisterRequest = {
  name: string
  email: string
  password: string
  globalRole: GlobalRole
}
