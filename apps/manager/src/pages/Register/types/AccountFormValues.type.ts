import type { SignupAccount } from '@shared/types/auth/signup-account'

export type AccountFormValues = SignupAccount & {
  confirmPassword: string
}
