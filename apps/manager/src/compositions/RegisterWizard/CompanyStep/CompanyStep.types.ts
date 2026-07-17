import type { SignupAccount, SignupCompany } from '@custom_types/auth'

export type CompanyFormValues = {
  company: SignupCompany
}

export type CompanyStepProps = {
  account: SignupAccount
  onBack: () => void
}
