import type { Store } from '@custom_types/store/store'

const store: Store = {
  id: 'store-1',
  slug: 'padaria-boa',
  customName: 'Padaria Boa',
  logoUrl: null,
  primaryColor: '#ff7a45',
  isPaused: false,
  timezone: 'America/Sao_Paulo',
  street: 'Rua das Flores',
  number: '123',
  neighborhood: 'Centro',
  city: 'São Paulo',
  state: 'SP',
  status: { name: 'active' },
  company: { name: 'Padaria Boa Ltda' },
}

export const useStoreTintMock: { slug: string; store: Store } = {
  slug: 'padaria-boa',
  store,
}
