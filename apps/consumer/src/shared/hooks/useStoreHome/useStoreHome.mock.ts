import type { Store } from '@shared/types/store/store'

export const storeWithHiddenBlocksMock = {
  slug: 'pizzaria',
  store: {
    slug: 'pizzaria',
    theme: {
      version: 3,
      configVersion: 1,
      templateId: 'classic',
      templateVersion: 1,
      config: {
        home: {
          showBanner: false,
          showSearch: false,
          showCategoryBar: true,
          showStoreInfo: true,
        },
      },
    },
  } as unknown as Store,
}

export const storeWithoutHomeChoiceMock = {
  slug: 'pizzaria',
  store: { slug: 'pizzaria' } as unknown as Store,
}
