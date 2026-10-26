import { describe, expect, it } from 'vitest'

import { toLowContrastPairs } from './toLowContrastPairs'
import {
  readableColorsMock,
  washedOutColorsMock,
} from './toLowContrastPairs.mock'

describe('toLowContrastPairs', () => {
  it('reports nothing when every pair is readable', () => {
    expect(toLowContrastPairs(readableColorsMock)).toEqual([])
  })

  it('reports the text pairs that fall below the readable ratio', () => {
    const pairs = toLowContrastPairs(washedOutColorsMock)

    expect(pairs.map(({ label }) => label)).toEqual([
      'Texto sobre o fundo',
      'Texto secundário sobre o fundo',
      'Texto sobre os cartões',
    ])
    pairs.forEach(({ ratio, minimum }) => expect(ratio).toBeLessThan(minimum))
  })

  it('measures the muted text against the background it sits on', () => {
    const pairs = toLowContrastPairs({
      ...readableColorsMock,
      mutedTextColor: '#DDDDDD',
    })

    expect(pairs).toHaveLength(1)
    expect(pairs[0].label).toBe('Texto secundário sobre o fundo')
  })
})
