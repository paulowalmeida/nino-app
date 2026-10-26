import { describe, expect, it } from 'vitest'

import { toStoreTheme } from './toStoreTheme'
import {
  storeThemeMock,
  storeWithPublishedThemeMock,
} from './toStoreTheme.mock'

describe('toStoreTheme', () => {
  it('preserves the default theme without store data', () => {
    expect(toStoreTheme()).toEqual({})
  })

  it('maps the store brand color to the storefront', () => {
    expect(toStoreTheme(storeThemeMock)).toMatchObject({
      '--store-tint': '#111111',
      '--color-brand': '#111111',
      '--color-brand-strong': '#111111',
      '--color-fg-on-brand': '#f4f4f4',
      '--color-surface-page': '#ffffff',
      '--color-surface-raised': '#fafafa',
      '--color-fg-strong': '#181818',
      '--color-border': '#dddddd',
      '--color-input-border': '#dddddd',
      '--store-secondary': '#222222',
      '--store-tertiary': '#f4f4f4',
    })
  })

  it('prefers the published theme over the legacy store columns', () => {
    expect(toStoreTheme(storeWithPublishedThemeMock)).toMatchObject({
      '--store-tint': '#A8342A',
      '--color-brand': '#A8342A',
      '--color-surface-page': '#FFFDFC',
      '--color-surface-raised': '#FFFFFF',
      '--color-fg-muted': '#767B74',
      '--store-radius': '20px',
    })
  })

  it('omits the radius while the store has no published theme', () => {
    expect(toStoreTheme(storeThemeMock)).not.toHaveProperty('--store-radius')
  })
})
