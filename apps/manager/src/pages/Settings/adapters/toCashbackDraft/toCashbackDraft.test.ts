import { describe, expect, it } from 'vitest'

import { toCashbackDraft } from './toCashbackDraft'
import { cashbackSettingsMock } from './toCashbackDraft.mock'

describe(toCashbackDraft.name, () => {
  it('writes the percent the way it is typed here', () => {
    expect(toCashbackDraft(cashbackSettingsMock).cashbackPercent).toBe('7,5')
  })

  it('writes the minimum in the masked money the field expects', () => {
    expect(toCashbackDraft(cashbackSettingsMock).cashbackMinRedeem).toBe(
      '12,40'
    )
  })

  it('carries the switch as it came from the store', () => {
    expect(toCashbackDraft(cashbackSettingsMock).cashbackEnabled).toBe(true)
  })
})
