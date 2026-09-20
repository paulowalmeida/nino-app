import type { Store } from '@shared/types/store/store'

export const storeThemeMock: Store = {
  id: 'store-1',
  slug: 'pizzaria',
  customName: 'Pizzaria',
  logoUrl: null,
  primaryColor: '#111111',
  secondaryColor: '#222222',
  tertiaryColor: '#f4f4f4',
  backgroundColor: '#ffffff',
  textColor: '#181818',
  cardColor: '#fafafa',
  borderColor: '#dddddd',
  mutedTextColor: '#666666',
  isPaused: false,
  timezone: 'America/Belem',
  street: 'Rua A',
  number: '10',
  neighborhood: 'Centro',
  city: 'Belem',
  state: 'PA',
  status: { name: 'OPEN' },
  company: { name: 'Nino' },
}

export const storeWithPublishedThemeMock: Store = {
  ...storeThemeMock,
  theme: {
    version: 3,
    configVersion: 1,
    templateId: 'classic',
    templateVersion: 1,
    config: {
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
      loading: { type: 'MASCOT' },
    },
  },
}
