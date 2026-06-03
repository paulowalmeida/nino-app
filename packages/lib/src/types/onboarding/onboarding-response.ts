import { Company } from '../company/company'
import { Subscription } from '../subscription/subscription'

export type OnboardingResponse = {
  company: Company
  subscription: Subscription
}
