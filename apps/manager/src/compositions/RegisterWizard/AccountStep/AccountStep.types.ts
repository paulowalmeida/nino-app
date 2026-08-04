import type { SignupAccount } from '@custom_types/auth'

export type AccountFormValues = SignupAccount & {
  confirmPassword: string
}
