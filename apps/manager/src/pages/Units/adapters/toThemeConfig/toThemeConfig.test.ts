import { describe, expect, it } from 'vitest'

import { toThemeConfig } from './toThemeConfig'
import {
  emptyColorsDraftMock,
  themeDraftMock,
  themeUnitMock,
} from './toThemeConfig.mock'

describe('toThemeConfig', () => {
  it('carries the edited colors and loading into the document', () => {
    const config = toThemeConfig(themeDraftMock, themeUnitMock)

    expect(config.colors.primary).toBe('#FF6B00')
    expect(config.colors.surface).toBe('#FFF9F4')
    expect(config.loading.type).toBe('DOTS')
  })

  it('takes the brand assets from the saved unit, not from the draft', () => {
    const config = toThemeConfig(themeDraftMock, themeUnitMock)

    expect(config.brand.logoUrl).toBe('https://cdn.nino.delivery/logo.png')
    expect(config.brand.bannerUrl).toBe('https://cdn.nino.delivery/banner.png')
  })

  it('records an unset color as null instead of an empty string', () => {
    const config = toThemeConfig(emptyColorsDraftMock, themeUnitMock)

    expect(config.colors.primary).toBeNull()
    expect(config.colors.border).toBeNull()
  })

  it('falls back to the default shape when the caller has none to send', () => {
    expect(toThemeConfig(themeDraftMock, themeUnitMock).shape).toEqual({
      radius: 'soft',
      border: 'line',
    })
  })

  it('keeps the document valid for a unit that has no assets yet', () => {
    const config = toThemeConfig(themeDraftMock, null)

    expect(config.brand).toEqual({
      logoUrl: null,
      faviconUrl: null,
      bannerUrl: null,
    })
  })
})
