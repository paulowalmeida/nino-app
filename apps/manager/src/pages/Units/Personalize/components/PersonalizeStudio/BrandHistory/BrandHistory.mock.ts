import type { ThemeEditorState } from '@pages/Units/types/ThemeEditorState.type'
import type { UnitTheme } from '@pages/Units/types/UnitTheme.type'

const baseVersion: UnitTheme = {
  id: 'theme-3',
  unitId: 'unit-1',
  version: 3,
  configVersion: 1,
  templateId: 'classic',
  templateVersion: 1,
  isDraft: null,
  isPublished: true,
  publishedAt: '2026-09-10T18:00:00.000Z',
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
}

export const historyEditorStateMock: ThemeEditorState = {
  published: baseVersion,
  draft: null,
  history: [
    { ...baseVersion, id: 'theme-2', version: 2, isPublished: null },
    {
      ...baseVersion,
      id: 'theme-1',
      version: 1,
      isPublished: null,
      publishedAt: null,
    },
  ],
}

export const emptyEditorStateMock: ThemeEditorState = {
  published: null,
  draft: null,
  history: [],
}
