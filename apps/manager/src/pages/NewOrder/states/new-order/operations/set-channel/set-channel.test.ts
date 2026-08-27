import { describe, expect, it, vi } from 'vitest'

import { setChannel } from './set-channel'
import { chosenChannelMock } from './set-channel.mock'

describe('setChannel', () => {
  it('writes how the order leaves the store', () => {
    const set = vi.fn()

    setChannel(set, chosenChannelMock)

    expect(set).toHaveBeenCalledWith({ channel: chosenChannelMock })
  })
})
