import { describe, expect, it } from 'vitest'
import type { Store } from '@custom_types/store/store'

import {
  storeThemeBannerUrl,
  storeThemeLogoUrl,
  storeThemePrimaryColor,
  storeThemeVariables,
} from './store-theme'

const legacy = {
  logoUrl: 'https://legacy.example/logo.png',
  bannerUrl: 'https://legacy.example/banner.png',
  primaryColor: '#ff6b00',
  secondaryColor: '#ff8a33',
  tertiaryColor: '#e8540c',
  backgroundColor: '#ffffff',
  textColor: '#333333',
  cardColor: '#fafafa',
  borderColor: '#dddddd',
  mutedTextColor: '#777777',
} as Store

describe('store theme', () => {
  it('uses legacy unit fields only when no published theme exists', () => {
    const store = { ...legacy, theme: null }

    expect(storeThemePrimaryColor(store)).toBe('#ff6b00')
    expect(storeThemeLogoUrl(store)).toBe('https://legacy.example/logo.png')
    expect(storeThemeBannerUrl(store)).toBe(
      'https://legacy.example/banner.png'
    )
  })

  it('makes the published theme authoritative', () => {
    const store = {
      ...legacy,
      theme: {
        config: {
          brand: {
            logoUrl: 'https://cdn.example/logo.png',
            bannerUrl: 'https://cdn.example/banner.png',
          },
          colors: {
            primary: '#123456',
            background: '#fefefe',
            surface: '#f5f5f5',
            text: '#202020',
            mutedText: '#707070',
            border: '#d0d0d0',
          },
          typography: { headingFont: 'default', bodyFont: 'default' },
          shape: { radius: 'round', border: 'line' },
        },
      } as never,
    } as Store

    expect(storeThemePrimaryColor(store)).toBe('#123456')
    expect(storeThemeLogoUrl(store)).toBe('https://cdn.example/logo.png')
    expect(storeThemeBannerUrl(store)).toBe('https://cdn.example/banner.png')
    expect(storeThemeVariables(store)).toMatchObject({
      '--color-brand': '#123456',
      '--color-surface-page': '#fefefe',
      '--color-surface-raised': '#f5f5f5',
      '--color-fg-default': '#202020',
      '--color-border': '#d0d0d0',
      '--radius-2': '12px',
    })
  })
})
