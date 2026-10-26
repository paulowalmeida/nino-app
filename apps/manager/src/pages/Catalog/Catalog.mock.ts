export const catalogPageMock = {
  successWithItems: {
    items: [{ id: 'item-1' }],
    status: 'success' as const,
  },
  error: {
    items: [],
    status: 'error' as const,
  },
  empty: {
    items: [],
    status: 'success' as const,
  },
  loading: {
    items: [],
    status: 'loading' as const,
  },
  errorMessage: 'Não foi possível carregar o cardápio',
}
