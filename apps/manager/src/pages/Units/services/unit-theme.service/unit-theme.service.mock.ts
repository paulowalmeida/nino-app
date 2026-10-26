import type { ThemeConfig } from '@pages/Units/types/ThemeConfig.type'
import type { ThemeEditorState } from '@pages/Units/types/ThemeEditorState.type'
import type { UnitTheme } from '@pages/Units/types/UnitTheme.type'

export const themeServiceUnitId = 'unit-1'

export const themeServiceConfigMock: ThemeConfig = {
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
}

export const publishedThemeMock: UnitTheme = {
  id: 'theme-1',
  unitId: themeServiceUnitId,
  version: 2,
  config: themeServiceConfigMock,
  configVersion: 1,
  templateId: 'classic',
  templateVersion: 1,
  isDraft: null,
  isPublished: true,
  publishedAt: '2026-09-01T12:00:00.000Z',
  publishedById: 'user-1',
}

export const draftThemeMock: UnitTheme = {
  ...publishedThemeMock,
  id: 'theme-2',
  version: 3,
  isDraft: true,
  isPublished: null,
  publishedAt: null,
  publishedById: null,
}

export const themeEditorStateMock: ThemeEditorState = {
  published: publishedThemeMock,
  draft: draftThemeMock,
  history: [],
}
