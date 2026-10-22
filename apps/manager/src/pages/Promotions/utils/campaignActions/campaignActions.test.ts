import { describe, expect, it } from 'vitest'

import { campaignActions } from './campaignActions'
import { unusedCampaignMock, usedCampaignMock } from './campaignActions.mock'

describe(campaignActions.name, () => {
  it('lets an unused active campaign be paused, edited, duplicated and ended', () => {
    expect(campaignActions({ ...unusedCampaignMock, state: 'ACTIVE' })).toEqual([
      'pause',
      'edit',
      'duplicate',
      'end',
    ])
  })

  it('locks editing once the campaign was used', () => {
    expect(campaignActions({ ...usedCampaignMock, state: 'PAUSED' })).toEqual([
      'resume',
      'duplicate',
      'end',
    ])
  })

  it('offers only duplicate for an ended campaign', () => {
    expect(campaignActions({ ...usedCampaignMock, state: 'ENDED' })).toEqual([
      'duplicate',
    ])
  })

  it('does not offer pause for an exhausted campaign', () => {
    expect(campaignActions({ ...usedCampaignMock, state: 'EXHAUSTED' })).toEqual([
      'duplicate',
      'end',
    ])
  })
})
