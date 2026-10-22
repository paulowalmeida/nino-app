import { describe, expect, it } from 'vitest'

import { toPromotionTabs } from './promotionTabs.adapter'
import { tabbedPromotionsMock } from './promotionTabs.adapter.mock'

const idsOf = (promotions: { id: string }[]) => promotions.map(({ id }) => id)

describe(toPromotionTabs.name, () => {
  it('puts paused, ended and exhausted campaigns together under Inativas', () => {
    const tabs = toPromotionTabs(tabbedPromotionsMock)

    expect(idsOf(tabs.active)).toEqual(['active-1'])
    expect(idsOf(tabs.scheduled)).toEqual(['scheduled-1'])
    expect(idsOf(tabs.inactive)).toEqual(['paused-1', 'ended-1', 'exhausted-1'])
  })

  it('finds a campaign by its code or by what it offers', () => {
    expect(idsOf(toPromotionTabs(tabbedPromotionsMock, 'fretevip').inactive)).toEqual([
      'exhausted-1',
    ])
    expect(
      idsOf(toPromotionTabs(tabbedPromotionsMock, 'qualquer pedido').inactive)
    ).toEqual(['exhausted-1'])
  })

  it('starts empty before the campaigns arrive', () => {
    expect(toPromotionTabs(undefined)).toEqual({
      active: [],
      scheduled: [],
      inactive: [],
    })
  })
})
