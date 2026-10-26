import { describe, expect, it, vi } from 'vitest'

import { endDrag } from './end-drag'
import { settledSessionMock } from './end-drag.mock'

describe('endDrag', () => {
  it('forgets the session once the card lands', () => {
    const set = vi.fn()
    endDrag(set)
    expect(set).toHaveBeenCalledWith(settledSessionMock)
  })
})
