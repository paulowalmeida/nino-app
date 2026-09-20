import type { Store } from '@shared/types/store/store'

export const storeWithBigImageCatalogMock = {
  slug: 'pizzaria',
  store: {
    slug: 'pizzaria',
    theme: {
      version: 2,
      configVersion: 1,
      templateId: 'classic',
      templateVersion: 1,
      config: {
        catalog: {
          itemStyle: 'big-image',
          imageRatio: '16:9',
          density: 'compact',
          showDescription: false,
        },
      },
    },
  } as unknown as Store,
}

export const storeWithoutCatalogChoiceMock = {
  slug: 'pizzaria',
  store: { slug: 'pizzaria' } as unknown as Store,
}
