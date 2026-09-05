import type { Customer } from '@custom_types/customer/customer'

export const useGoogleSignInMock = {
  idToken: 'google-id-token',
  customer: { id: 'cust-1', name: 'Ana Souza' } as Customer,
}
