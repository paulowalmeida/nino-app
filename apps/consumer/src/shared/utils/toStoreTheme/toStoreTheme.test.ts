import { describe, expect, it } from 'vitest'

import { toStoreTheme } from './toStoreTheme'
import { storeThemeMock } from './toStoreTheme.mock'

describe('toStoreTheme', () => {
  it('preserves the default theme without store data', () => {
    expect(toStoreTheme()).toEqual({})
  })

  it('maps all eight saved colors to the storefront', () => {
    expect(toStoreTheme(storeThemeMock)).toMatchObject({
      '--store-tint': '#111111',
      '--store-secondary': '#222222',
      '--store-highlight': '#333333',
      '--color-surface-page': '#444444',
      '--color-fg-default': '#555555',
      '--color-surface-raised': '#666666',
      '--color-border': '#777777',
      '--color-fg-subtle': '#888888',
    })
  })
})
