import type { Store } from '@custom_types/store/store'

export const storefrontStoreMock = {
  id: 'store-1',
  company: { name: 'Bistrô do Zé' },
  customName: 'Bistrô do Zé',
  primaryColor: '#ff6b35',
  logoUrl: null,
  slug: 'loja-do-ze',
  isPaused: false,
  timezone: 'America/Sao_Paulo',
  street: 'Rua das Flores',
  number: '123',
  neighborhood: 'Centro',
  city: 'São Paulo',
  state: 'SP',
  status: { name: 'ACTIVE' },
} as Store

export const storefrontPathMock = {
  slug: 'loja-do-ze',
}
