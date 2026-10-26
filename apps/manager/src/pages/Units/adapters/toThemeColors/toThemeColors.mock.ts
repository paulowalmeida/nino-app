import type { ThemeConfig } from '@pages/Units/types/ThemeConfig.type'

export const publishedThemeConfigMock: ThemeConfig = {
  brand: { logoUrl: null, faviconUrl: null, bannerUrl: null },
  colors: {
    primary: '#A8342A',
    secondary: '#2B2B2B',
    tertiary: '#FFF7F5',
    background: '#FFFDFC',
    surface: '#FFFFFF',
    text: '#1B1D1A',
    mutedText: '#767B74',
    border: '#E2DFD6',
  },
  typography: { headingFont: 'default', bodyFont: 'default' },
  shape: { radius: 'round', border: 'line' },
  loading: { type: 'SPINNER' },
}

export const unsetColorsThemeConfigMock: ThemeConfig = {
  ...publishedThemeConfigMock,
  colors: {
    primary: null,
    secondary: null,
    tertiary: null,
    background: null,
    surface: null,
    text: null,
    mutedText: null,
    border: null,
  },
}
