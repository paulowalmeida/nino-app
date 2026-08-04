import type { TenantDetail } from '@custom_types/store'

export const branchUnit: TenantDetail = {
  id: 'tenant-2',
  isMain: false,
  customName: 'Unidade Centro',
  slug: 'padaria-centro',
  logoUrl: null,
  primaryColor: '#FF6B00',
  timezone: 'America/Sao_Paulo',
  zipCode: '01001000',
  street: 'Praça da Sé',
  number: '100',
  complement: null,
  neighborhood: 'Sé',
  city: 'São Paulo',
  state: 'SP',
}

export const mainUnit: TenantDetail = {
  ...branchUnit,
  id: 'tenant-1',
  isMain: true,
  customName: 'Matriz',
  slug: 'padaria-matriz',
}
