import { describe, expect, it } from 'vitest'

import { tabSplitShortcuts } from './tabSplitShortcuts'
import { tabSplitShortcutsMock } from './tabSplitShortcuts.mock'

describe('tabSplitShortcuts', () => {
  it('offers the whole remainder and its split among 2, 3 and 4 people', () => {
    expect(tabSplitShortcuts(tabSplitShortcutsMock.remainingAmount)).toEqual([
      { label: 'Tudo', description: 'Pagar tudo que falta', amount: 100 },
      { label: '÷2', description: 'Dividir o que falta por 2', amount: 50 },
      { label: '÷3', description: 'Dividir o que falta por 3', amount: 33.33 },
      { label: '÷4', description: 'Dividir o que falta por 4', amount: 25 },
    ])
  })

  it('drops splits that would round to zero cents', () => {
    expect(
      tabSplitShortcuts(tabSplitShortcutsMock.oddCentsAmount).map(
        (shortcut) => shortcut.amount
      )
    ).toEqual([0.02, 0.01])
  })
})
