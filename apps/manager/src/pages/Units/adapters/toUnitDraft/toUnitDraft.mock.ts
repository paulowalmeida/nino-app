import type { UnitDetail } from '@shared/types/store/unit-detail'

export const unitDetailMock: UnitDetail = {
  id: 'unit-1',
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
