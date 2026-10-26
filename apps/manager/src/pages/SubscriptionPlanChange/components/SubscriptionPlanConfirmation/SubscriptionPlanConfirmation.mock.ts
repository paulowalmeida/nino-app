import type { SubscriptionPlan } from '@shared/types/profile/subscription'

export const subscriptionPlanConfirmationMock: {
  currentPlan: SubscriptionPlan
  nextPlan: SubscriptionPlan
} = {
  currentPlan: {
    id: 'plan-pro',
    name: 'Pro',
    slug: 'pro',
    price: '299.00',
    maxUnits: 3,
  },
  nextPlan: {
    id: 'plan-standard',
    name: 'Padrão',
    slug: 'padrao',
    price: '199.00',
    maxUnits: 1,
  },
}
