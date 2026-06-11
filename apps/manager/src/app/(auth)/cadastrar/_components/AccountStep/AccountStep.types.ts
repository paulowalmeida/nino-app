import type { SignupRequest } from "@nino/lib"

export type AccountFormValues = SignupRequest["account"] & {
  confirmPassword: string
}

export type AccountStepProps = {
  onNext: (account: SignupRequest["account"]) => void
}
