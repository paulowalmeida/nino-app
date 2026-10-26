import type { Store } from '@custom_types/store/store'

export const useStoreMock: { store: Store } = {
  store: {
    id: 'store-1',
    slug: 'pizzaria',
    customName: 'Pizzaria',
    logoUrl: null,
    primaryColor: null,
    isPaused: false,
    timezone: 'America/Belem',
    street: 'Rua A',
    number: '10',
    neighborhood: 'Centro',
    city: 'Belém',
    state: 'PA',
    status: { name: 'OPEN' },
    company: { name: 'Nino' },
  },
}
