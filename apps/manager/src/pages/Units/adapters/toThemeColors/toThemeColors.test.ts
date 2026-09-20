import { describe, expect, it } from 'vitest'

import { toThemeColors } from './toThemeColors'
import {
  publishedThemeConfigMock,
  unsetColorsThemeConfigMock,
} from './toThemeColors.mock'

describe('toThemeColors', () => {
  it('maps the document colors onto the controls', () => {
    expect(toThemeColors(publishedThemeConfigMock)).toMatchObject({
      primaryColor: '#A8342A',
      cardColor: '#FFFFFF',
      mutedTextColor: '#767B74',
    })
  })

  it('carries the loading style published to the storefront', () => {
    expect(toThemeColors(publishedThemeConfigMock).loadingType).toBe('SPINNER')
  })

  it('turns an unset color into an empty control instead of black', () => {
    const colors = toThemeColors(unsetColorsThemeConfigMock)

    expect(colors.primaryColor).toBe('')
    expect(colors.backgroundColor).toBe('')
  })
})
