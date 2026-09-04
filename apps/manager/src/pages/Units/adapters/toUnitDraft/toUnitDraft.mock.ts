import type { TenantDetail } from '@shared/types/store/tenant-detail'

export const tenantDetailMock: TenantDetail = {
  id: 'tenant-1',
  slug: 'unidade-centro',
  customName: 'Unidade Centro',
  timezone: 'America/Sao_Paulo',
  primaryColor: '#FF6B00',
  loadingType: 'MASCOT',
  zipCode: '01001000',
  street: 'Praça da Sé',
  number: '10',
  neighborhood: 'Sé',
  city: 'São Paulo',
  state: 'SP',
  deliveryCities: [
    { city: 'São Paulo', state: 'SP' },
    { city: 'Osasco', state: 'SP' },
  ],
  isMain: true,
}
