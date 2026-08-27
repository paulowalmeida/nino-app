export const newUnitFacadeMock = {
  typeOptions: [{ value: 'restaurant', label: 'Restaurante' }],
  submitStore: async () => ({ status: 'success' as const }),
  isStoreTypesPending: false,
}
