import { describe, expect, it } from 'vitest'

import { toScopeProductOptions } from './scopeProductOptions.adapter'
import { scopeMenuMock } from './scopeProductOptions.adapter.mock'

describe(toScopeProductOptions.name, () => {
  it('lists the active products in alphabetical order', () => {
    expect(toScopeProductOptions(scopeMenuMock)).toEqual([
      { value: 'batata', label: 'Batata frita' },
      { value: 'x-salada', label: 'X-Salada' },
    ])
  })
})
