import { describe, expect, it } from 'vitest'

import { toStoreTheme } from './toStoreTheme'
import { storeThemeMock } from './toStoreTheme.mock'

describe('toStoreTheme', () => {
  it('preserves the default theme without store data', () => {
    expect(toStoreTheme()).toEqual({})
  })

  it('maps the store brand color to the storefront', () => {
    expect(toStoreTheme(storeThemeMock)).toMatchObject({
      '--store-tint': '#111111',
      '--color-brand': '#111111',
      '--color-brand-strong': '#111111',
    })
  })
})
