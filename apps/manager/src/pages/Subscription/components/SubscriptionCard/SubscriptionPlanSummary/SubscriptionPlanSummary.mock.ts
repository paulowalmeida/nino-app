import type { Subscription } from '@shared/types/profile/subscription'

export const proPlanMock: Subscription['plan'] = {
  id: 'plan-1',
  name: 'Pro',
  slug: 'pro',
  price: '99.00',
  maxUnits: 5,
}
