import { describe, expect, it } from 'vitest'

import { DEFAULT_CATALOG_DRAFT } from '@pages/Units/constants/catalog.constants'

import { toCatalogDraft } from './toCatalogDraft'
import {
  configWithCatalogMock,
  configWithoutCatalogMock,
} from './toCatalogDraft.mock'

describe('toCatalogDraft', () => {
  it('brings back the presentation the store chose', () => {
    expect(toCatalogDraft(configWithCatalogMock)).toEqual({
      itemStyle: 'big-image',
      imageRatio: '16:9',
      density: 'compact',
      showDescription: false,
    })
  })

  it('falls back to the nino default for an older document', () => {
    expect(toCatalogDraft(configWithoutCatalogMock)).toEqual(
      DEFAULT_CATALOG_DRAFT
    )
  })
})
