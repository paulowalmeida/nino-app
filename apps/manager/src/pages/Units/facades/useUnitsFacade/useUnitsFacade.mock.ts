export const unitsFacadeMock = {
  user: { name: 'Marina Silva' },
  logout: async () => undefined,
  typeOptions: [{ value: 'restaurant', label: 'Restaurante' }],
  submitStore: async () => ({ status: 'success' as const }),
}
