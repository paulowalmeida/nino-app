export const useSignInFacadeMock = {
  home: '/padaria-boa',
  store: { id: 'store-1', name: 'Padaria Boa' },
  step: 'identify' as const,
  channel: 'phone' as const,
  phone: '11987654321',
  email: 'cliente@example.com',
  code: '482913',
}
