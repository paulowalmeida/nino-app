import { useSubscription } from '@hooks/account/useSubscription'

type SubscriptionResult = ReturnType<typeof useSubscription>

export const planWithThreeUnits = {
  data: { plan: { name: 'Balcão', maxTenants: 3 } },
  isPending: false,
} as unknown as SubscriptionResult

export const unlimitedPlan = {
  data: { plan: { name: 'Salão', maxTenants: null } },
  isPending: false,
} as unknown as SubscriptionResult

export const pendingPlan = {
  data: undefined,
  isPending: true,
} as unknown as SubscriptionResult
