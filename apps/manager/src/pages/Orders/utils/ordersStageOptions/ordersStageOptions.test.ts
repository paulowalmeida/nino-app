import { describe, expect, it } from 'vitest'

import { ordersStageOptions } from './ordersStageOptions'
import { ordersStageOptionsMock } from './ordersStageOptions.mock'

describe('ordersStageOptions', () => {
  it('aggregates status counts into stage counts', () => {
    const options = ordersStageOptions(ordersStageOptionsMock.summary)

    expect(options.find(({ id }) => id === 'incoming')?.count).toBe(2)
    expect(options.find(({ id }) => id === 'closed')?.count).toBe(21)
  })
})
