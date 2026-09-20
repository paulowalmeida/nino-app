import { describe, expect, it } from 'vitest'

import { DEFAULT_HOME_DRAFT } from '@pages/Units/constants/home.constants'

import { toHomeDraft } from './toHomeDraft'
import {
  configWithHiddenBannerMock,
  configWithoutHomeChoiceMock,
} from './toHomeDraft.mock'

describe('toHomeDraft', () => {
  it('keeps the blocks the store turned off', () => {
    const home = toHomeDraft(configWithHiddenBannerMock)

    expect(home.showBanner).toBe(false)
    expect(home.showCategoryBar).toBe(false)
    expect(home.showSearch).toBe(true)
  })

  it('shows everything for a document published before the choice existed', () => {
    expect(toHomeDraft(configWithoutHomeChoiceMock)).toEqual(DEFAULT_HOME_DRAFT)
  })
})
