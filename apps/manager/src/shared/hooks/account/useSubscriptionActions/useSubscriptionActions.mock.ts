import type { Subscription } from '@shared/types/profile/subscription'

export const subscriptionAfterMutationMock: Subscription = {
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
}
