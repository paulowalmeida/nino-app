import { describe, expect, it } from 'vitest'

import { promotionPhotos } from './promotion-photos'
import {
  anyOrderPromotionMock,
  eligibleItemsPromotionMock,
  photoSectionsMock,
} from './promotion-photos.mock'

describe('promotionPhotos', () => {
  it('uses the first menu items with an uploaded photo', () => {
    expect(promotionPhotos(anyOrderPromotionMock, photoSectionsMock)).toEqual([
      'https://cdn.example/burger.png',
      'https://cdn.example/fries.png',
    ])
  })

  it('prefers the items the promotion applies to', () => {
    expect(
      promotionPhotos(eligibleItemsPromotionMock, photoSectionsMock)
    ).toEqual(['https://cdn.example/soda.png'])
  })
})
