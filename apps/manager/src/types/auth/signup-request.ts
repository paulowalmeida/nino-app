import type { SignupAccount } from './signup-account'
import type { SignupCompany } from './signup-company'

export type SignupRequest = {
  account: SignupAccount
  company: SignupCompany
}
