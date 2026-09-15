import type { UnitDetail } from '@shared/types/store/unit-detail'

export const personalizeUnitMock: UnitDetail = {
  id: 'unit-1',
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
