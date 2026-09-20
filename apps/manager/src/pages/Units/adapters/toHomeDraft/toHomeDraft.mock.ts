import type { ThemeConfig } from '@pages/Units/types/ThemeConfig.type'

const baseConfig = {
  brand: { logoUrl: null, faviconUrl: null, bannerUrl: null },
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
  typography: { headingFont: 'default', bodyFont: 'default' },
  shape: { radius: 'soft', border: 'line' },
  loading: { type: 'MASCOT' },
} as ThemeConfig

export const configWithHiddenBannerMock: ThemeConfig = {
  ...baseConfig,
  home: {
    showBanner: false,
    showSearch: true,
    showCategoryBar: false,
    showStoreInfo: true,
  },
}

export const configWithoutHomeChoiceMock: ThemeConfig = baseConfig
