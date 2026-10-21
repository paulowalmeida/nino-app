import type { SubscriptionPlan } from '@shared/types/profile/subscription'

export const subscriptionPlanChoiceMock: {
  currentPlan: SubscriptionPlan
  plans: SubscriptionPlan[]
} = {
  currentPlan: {
    id: 'plan-pro',
    name: 'Pro',
    slug: 'pro',
    price: '299.00',
    maxUnits: 3,
  },
  plans: [
    {
      id: 'plan-pro',
      name: 'Pro',
      slug: 'pro',
      price: '299.00',
      maxUnits: 3,
    },
    {
      id: 'plan-standard',
      name: 'Padrão',
      slug: 'padrao',
      price: '199.00',
      maxUnits: 1,
    },
    {
      id: 'plan-network',
      name: 'Rede',
      slug: 'rede',
      price: '0.00',
      maxUnits: null,
    },
  ],
}
