import { describe, expect, it, vi } from 'vitest'

import { setConsumerName } from './set-consumer-name'

describe(setConsumerName.name, () => {
  it('sets the consumer name', () => {
    const set = vi.fn()
    setConsumerName(set, 'Ana')
    expect(set).toHaveBeenCalledWith({ consumerName: 'Ana' })
  })
})
