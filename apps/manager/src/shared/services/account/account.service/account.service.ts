import { api } from '@shared/services/http/http.service'
import type {
  Subscription,
  SubscriptionPlan,
} from '@shared/types/profile/subscription'
import type {
  CreateSubscriptionInterestInput,
  SubscriptionInterestResponse,
} from '@shared/types/profile/subscription-interest'

export const AccountService = {
  getSubscription: (): Promise<Subscription> =>
    api.get<Subscription>('my/subscription'),
  getPlans: (): Promise<SubscriptionPlan[]> =>
    api.get<SubscriptionPlan[]>('my/subscription/plans'),
  changePlan: (planId: string): Promise<Subscription> =>
    api.patch<{ planId: string }, Subscription>('my/subscription/plan', {
      planId,
    }),
  cancelSubscription: (): Promise<Subscription> =>
    api.patch<Record<string, never>, Subscription>(
      'my/subscription/cancel',
      {}
    ),
  requestSubscriptionInterest: (
    input: CreateSubscriptionInterestInput
  ): Promise<SubscriptionInterestResponse> =>
    api.create<CreateSubscriptionInterestInput, SubscriptionInterestResponse>(
      'my/subscription/interest',
      input
    ),
}
