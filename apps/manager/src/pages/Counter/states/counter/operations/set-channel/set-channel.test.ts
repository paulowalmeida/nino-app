import { describe, expect, it, vi } from 'vitest'

import { setChannel } from './set-channel'
import { counterSetChannelMock } from './set-channel.mock'

describe(setChannel.name, () => {
  it('sets the chosen channel', () => {
    const set = vi.fn()
    setChannel(set, counterSetChannelMock.channel)
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining(counterSetChannelMock)
    )
  })

  it('drops the table number so it does not leak into another channel', () => {
    const set = vi.fn()
    setChannel(set, 'DELIVERY')
    expect(set).toHaveBeenCalledWith({
      channel: 'DELIVERY',
      tableNumber: '',
      recipient: {
        name: '',
        phone: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        zoneId: '',
      },
    })
  })
})
