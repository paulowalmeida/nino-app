import type { SignupAccount } from '@custom_types/auth'

export type AccountFormValues = SignupAccount & {
  confirmPassword: string
}

export type AccountStepProps = {
  defaultValues?: SignupAccount | null
  onNext: (account: SignupAccount) => void
}
