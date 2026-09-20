import type { ThemeEditorState } from '@pages/Units/types/ThemeEditorState.type'
import type { UnitDetail } from '@shared/types/store/unit-detail'

export const personalizeStudioUnitMock: UnitDetail = {
  id: 'unit-1',
  slug: 'unidade-centro',
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

export const themeEditorStateMock: ThemeEditorState = {
  published: {
    id: 'theme-1',
    unitId: 'unit-1',
    version: 4,
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
        primary: '#FF6B00',
        secondary: '#2D1B0E',
        tertiary: '#FFF3E8',
        background: '#FFFFFF',
        surface: '#FFF9F4',
        text: '#241A12',
        mutedText: '#7A6A5B',
        border: '#E7D8C7',
      },
      typography: { headingFont: 'default', bodyFont: 'default' },
      shape: { radius: 'soft', border: 'line' },
      loading: { type: 'MASCOT' },
    },
  },
  draft: null,
  history: [],
}
