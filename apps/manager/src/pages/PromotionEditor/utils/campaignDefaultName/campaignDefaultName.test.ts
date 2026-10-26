import { describe, expect, it } from 'vitest'

import { campaignDefaultName } from './campaignDefaultName'
import { campaignCreatedAtMock } from './campaignDefaultName.mock'

describe(campaignDefaultName.name, () => {
  it('names the campaign by its type and creation date', () => {
    expect(campaignDefaultName('gift', campaignCreatedAtMock)).toBe(
      'Brinde - 11/11/26'
    )
    expect(campaignDefaultName('discount', campaignCreatedAtMock)).toBe(
      'Desconto - 11/11/26'
    )
  })

  it('leaves a package unnamed because the customer reads its name', () => {
    expect(campaignDefaultName('package', campaignCreatedAtMock)).toBe('')
  })
})
