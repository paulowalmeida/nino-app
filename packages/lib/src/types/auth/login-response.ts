import { Tokens } from './tokens'
import { User } from '../user/user'

export type LoginResponse = {
  user: User
  tokens: Tokens
}
