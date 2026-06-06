import type { CompleteOnboardingRequest } from "@nino/lib"

export type CompanyFormValues = Pick<CompleteOnboardingRequest, "company">

export type CompanyStepProps = {
  responsible: CompleteOnboardingRequest["responsible"]
}
