import type { ThemeConfig } from '@pages/Units/types/ThemeConfig.type'

const baseConfig: ThemeConfig = {
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

export const configWithTrackingMock: ThemeConfig = {
  ...baseConfig,
  tracking: {
    stageLabels: { PENDING: 'Pedido na casa', PREPARING: 'Tá na chapa' },
    waitingMessage: 'Separa o guardanapo.',
  },
}

export const configWithoutTrackingMock: ThemeConfig = baseConfig
