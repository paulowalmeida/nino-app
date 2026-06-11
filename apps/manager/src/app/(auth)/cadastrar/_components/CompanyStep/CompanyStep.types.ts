import type { SignupRequest } from "@nino/lib"

export type CompanyFormValues = Pick<SignupRequest, "company">

export type CompanyStepProps = {
  account: SignupRequest["account"]
  onBack: () => void
}
