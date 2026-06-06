import type { CompleteOnboardingRequest } from '@nino/lib'

export type AccountFormValues = CompleteOnboardingRequest['responsible'] & {
  password: string
  confirmPassword: string
}

export type AccountStepProps = {
  onNext: (responsible: CompleteOnboardingRequest['responsible']) => void
}
