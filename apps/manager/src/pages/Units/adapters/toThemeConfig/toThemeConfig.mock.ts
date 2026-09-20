import type { UnitDetail } from '@shared/types/store/unit-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'

export const themeDraftMock: UnitDraft = {
  customName: 'Unidade Centro',
  timezone: 'America/Sao_Paulo',
  primaryColor: '#FF6B00',
  secondaryColor: '#2D1B0E',
  tertiaryColor: '#FFF3E8',
  backgroundColor: '#FFFFFF',
  textColor: '#241A12',
  cardColor: '#FFF9F4',
  borderColor: '#E7D8C7',
  mutedTextColor: '#7A6A5B',
  loadingType: 'DOTS',
  zipCode: '01001000',
  street: 'Praça da Sé',
  number: '10',
  complement: '',
  neighborhood: 'Sé',
  city: 'São Paulo',
  state: 'SP',
  deliveryCities: [],
}

export const themeUnitMock: UnitDetail = {
  id: 'unit-1',
  slug: 'unidade-centro',
  customName: 'Unidade Centro',
  logoUrl: 'https://cdn.nino.delivery/logo.png',
  bannerUrl: 'https://cdn.nino.delivery/banner.png',
} as unknown as UnitDetail

export const emptyColorsDraftMock: UnitDraft = {
  ...themeDraftMock,
  primaryColor: '',
  secondaryColor: '',
  tertiaryColor: '',
  backgroundColor: '',
  textColor: '',
  cardColor: '',
  borderColor: '',
  mutedTextColor: '',
}
