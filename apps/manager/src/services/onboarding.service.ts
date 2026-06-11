import { getCookie } from "@lib/cookies"
import { httpConfig } from "@lib/http"

import type { CompleteOnboardingRequest, OnboardingResponse } from "@nino/lib"
import { post } from "@nino/lib"

export function completeOnboarding(
  data: CompleteOnboardingRequest,
): Promise<OnboardingResponse> {
  return post<OnboardingResponse>(
    httpConfig(() => getCookie("accessToken")),
    "/onboarding",
    data,
  )
}
