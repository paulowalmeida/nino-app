import { describe, expect, it } from 'vitest'
import { ActiveOrderBanner } from './ActiveOrderBanner'
import { activeOrderBannerMock } from './ActiveOrderBanner.mock'

describe('ActiveOrderBanner', () => {
  it('exports the store order banner', () => {
    expect(ActiveOrderBanner).toBeDefined()
    expect(activeOrderBannerMock.slug).toBeTruthy()
  })
})
