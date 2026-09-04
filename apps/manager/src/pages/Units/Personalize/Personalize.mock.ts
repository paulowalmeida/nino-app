import type { TenantDetail } from '@shared/types/store/tenant-detail'

export const personalizeUnitMock: TenantDetail = {
  id: 'tenant-1',
  slug: 'unidade-centro',
  customName: 'Unidade Centro',
  timezone: 'America/Sao_Paulo',
  loadingType: 'MASCOT',
  zipCode: '01001000',
  street: 'Praça da Sé',
  number: '10',
  neighborhood: 'Sé',
  city: 'São Paulo',
  state: 'SP',
  deliveryCities: [{ city: 'São Paulo', state: 'SP' }],
  isMain: true,
}
