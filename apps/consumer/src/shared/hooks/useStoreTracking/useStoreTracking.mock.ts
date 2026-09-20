import type { Store } from '@shared/types/store/store'

export const storeWithTrackingVoiceMock = {
  slug: 'pizzaria',
  store: {
    slug: 'pizzaria',
    theme: {
      version: 2,
      configVersion: 1,
      templateId: 'classic',
      templateVersion: 1,
      config: {
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
        tracking: {
          stageLabels: { PREPARING: 'Tá na chapa' },
          waitingMessage: 'Separa o guardanapo.',
        },
      },
    },
  } as unknown as Store,
}

export const storeWithoutThemeMock = {
  slug: 'pizzaria',
  store: { slug: 'pizzaria' } as unknown as Store,
}
