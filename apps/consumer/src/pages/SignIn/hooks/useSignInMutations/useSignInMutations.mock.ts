import type { Consumer } from '@custom_types/consumer/consumer'

export const useSignInMutationsMock = {
  home: '/padaria-boa',
  credentials: { phone: '+5511987654321' },
  code: '482913',
  phone: '+5511987654321',
  name: 'Ana Souza',
  completedConsumer: {
    id: 'cust-1',
    name: 'Ana Souza',
    profileCompletedAt: '2026-01-10T12:00:00.000Z',
  } as Consumer,
  incompleteConsumer: {
    id: 'cust-2',
    name: 'Ana Souza',
    profileCompletedAt: null,
  } as Consumer,
}
