import type {
  Subscription,
  SubscriptionPlan,
} from '@shared/types/profile/subscription'

export const subscriptionActionsMock: {
  subscription: Subscription
  plans: SubscriptionPlan[]
} = {
  subscription: {
    id: 'sub-1',
    companyId: 'company-1',
    isActive: true,
    startedAt: '2026-01-01T00:00:00.000Z',
    trialEndsAt: null,
    expiresAt: null,
    plan: {
      id: 'plan-pro',
      name: 'Pro',
      slug: 'pro',
      price: '299.00',
      maxUnits: 3,
    },
    subscriptionStatus: { id: 'status-1', name: 'Ativa' },
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
      id: 'plan-default',
      name: 'Padrão',
      slug: 'padrao',
      price: '199.00',
      maxUnits: 1,
    },
    {
      id: 'plan-rede',
      name: 'Rede',
      slug: 'rede',
      price: '0.00',
      maxUnits: null,
    },
  ],
}
