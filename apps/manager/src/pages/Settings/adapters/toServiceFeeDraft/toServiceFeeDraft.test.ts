import { describe, expect, it } from 'vitest'

import { toServiceFeeDraft } from './toServiceFeeDraft'
import { toServiceFeeDraftMock } from './toServiceFeeDraft.mock'

describe('toServiceFeeDraft', () => {
  it('writes the percent with a decimal comma for the field', () => {
    expect(toServiceFeeDraft(toServiceFeeDraftMock.settings)).toEqual({
      serviceFeeEnabled: true,
      serviceFeePercent: '12,5',
    })
  })
})
