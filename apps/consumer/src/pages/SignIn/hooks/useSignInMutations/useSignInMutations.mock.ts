import type { Customer } from '@custom_types/customer/customer'

export const useSignInMutationsMock = {
  home: '/padaria-boa',
  credentials: { phone: '+5511987654321' },
  code: '482913',
  phone: '+5511987654321',
  name: 'Ana Souza',
  completedCustomer: {
    id: 'cust-1',
    name: 'Ana Souza',
    profileCompletedAt: '2026-01-10T12:00:00.000Z',
  } as Customer,
  incompleteCustomer: {
    id: 'cust-2',
    name: 'Ana Souza',
    profileCompletedAt: null,
  } as Customer,
  incompleteEmailPlaceholder: {
    id: 'cust-3',
    name: 'ana@nino.dev',
    profileCompletedAt: null,
  } as Customer,
}
