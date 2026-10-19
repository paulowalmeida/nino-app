import { describe, expect, it } from 'vitest'

import { tabMomentLabel } from './tabMomentLabel'
import { tabMomentLabelMock } from './tabMomentLabel.mock'

describe('tabMomentLabel', () => {
  it('writes the moment as date and time in the store timezone', () => {
    expect(tabMomentLabel(tabMomentLabelMock.isoMoment)).toBe(
      tabMomentLabelMock.label
    )
  })
})
