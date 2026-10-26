import type { ThemeEditorState } from '@pages/Units/types/ThemeEditorState.type'
import type { UnitDetail } from '@shared/types/store/unit-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'

export const themeUnitIdMock = 'unit-1'

export const themeEditorStateMock: ThemeEditorState = {
  published: {
    id: 'theme-1',
    unitId: themeUnitIdMock,
    version: 2,
    configVersion: 1,
    templateId: 'classic',
    templateVersion: 1,
    isDraft: null,
    isPublished: true,
    publishedAt: '2026-09-01T12:00:00.000Z',
    publishedById: 'user-1',
    config: {
      brand: { logoUrl: null, faviconUrl: null, bannerUrl: null },
      colors: {
        primary: '#A8342A',
        secondary: '#2B2B2B',
        tertiary: null,
        background: '#FFFFFF',
        surface: '#FAF9F6',
        text: '#1B1D1A',
        mutedText: '#767B74',
        border: '#E2DFD6',
      },
      typography: { headingFont: 'default', bodyFont: 'default' },
      shape: { radius: 'soft', border: 'line' },
      loading: { type: 'MASCOT' },
    },
  },
  draft: null,
  history: [],
}

export const unitDraftMock: UnitDraft = {
  customName: 'Unidade Centro',
  timezone: 'America/Sao_Paulo',
  primaryColor: '#A8342A',
  secondaryColor: '#2B2B2B',
  tertiaryColor: '',
  backgroundColor: '#FFFFFF',
  textColor: '#1B1D1A',
  cardColor: '#FAF9F6',
  borderColor: '#E2DFD6',
  mutedTextColor: '#767B74',
  loadingType: 'MASCOT',
  zipCode: '01001000',
  street: 'Praça da Sé',
  number: '10',
  complement: '',
  neighborhood: 'Sé',
  city: 'São Paulo',
  state: 'SP',
  deliveryCities: [],
}

export const unitDetailMock: UnitDetail = {
  id: themeUnitIdMock,
  slug: 'unidade-centro',
  customName: 'Unidade Centro',
  logoUrl: 'https://cdn.nino.delivery/logo.png',
  bannerUrl: null,
} as unknown as UnitDetail

export const uploadedUnitDetailMock: UnitDetail = {
  ...unitDetailMock,
  logoUrl: 'https://cdn.nino.delivery/logo-novo.png',
}
