import type {
  CreateSubscriptionInterestInput,
  SubscriptionInterestResponse,
} from '@shared/types/profile/subscription-interest'

export const subscriptionInterestInputMock = {
  contactName: 'Paulo',
  contactEmail: 'paulo@nino.delivery',
  preferredContactMethod: 'EMAIL',
  unitCount: 12,
  needs: 'Operação com várias unidades',
} satisfies CreateSubscriptionInterestInput

export const subscriptionInterestResponseMock = {
  id: 'interest-1',
  status: 'PENDING',
  createdAt: '2026-10-15T12:00:00.000Z',
} satisfies SubscriptionInterestResponse
