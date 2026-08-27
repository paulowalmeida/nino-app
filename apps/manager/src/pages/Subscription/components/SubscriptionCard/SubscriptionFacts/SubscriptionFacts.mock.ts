import type { Subscription } from '@shared/types/profile/subscription'

export const trialSubscriptionMock: Subscription = {
  id: 'sub-2',
  companyId: 'company-1',
  isActive: true,
  startedAt: '2026-02-01T00:00:00.000Z',
  trialEndsAt: '2026-02-15T00:00:00.000Z',
  expiresAt: null,
  plan: {
    id: 'plan-1',
    name: 'Pro',
    slug: 'pro',
    price: '99.00',
    maxTenants: 5,
  },
  subscriptionStatus: { id: 'status-1', name: 'Ativa' },
}
