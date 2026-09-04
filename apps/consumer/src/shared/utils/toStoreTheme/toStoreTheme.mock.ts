import type { Store } from '@shared/types/store/store'

export const storeThemeMock: Store = {
  id: 'store-1',
  slug: 'pizzaria',
  customName: 'Pizzaria',
  logoUrl: null,
  primaryColor: '#111111',
  isPaused: false,
  timezone: 'America/Belem',
  street: 'Rua A',
  number: '10',
  neighborhood: 'Centro',
  city: 'Belem',
  state: 'PA',
  status: { name: 'OPEN' },
  company: { name: 'Nino' },
}
