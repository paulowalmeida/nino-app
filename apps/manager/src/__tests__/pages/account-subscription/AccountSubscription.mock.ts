import type { Subscription } from '@custom_types/account'

export const activeSubscription: Subscription = {
  id: 'sub-1',
  companyId: 'company-1',
  isActive: true,
  startedAt: '2026-01-01T00:00:00.000Z',
  trialEndsAt: null,
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
