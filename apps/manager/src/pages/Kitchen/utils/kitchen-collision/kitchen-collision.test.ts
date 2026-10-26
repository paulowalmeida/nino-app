import { closestCorners, pointerWithin } from '@dnd-kit/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { kitchenCollision } from './kitchen-collision'
import {
  cornerCollisionMock,
  kitchenCollisionArgumentsMock,
  pointerCollisionMock,
} from './kitchen-collision.mock'

vi.mock('@dnd-kit/core', () => ({
  closestCorners: vi.fn(),
  pointerWithin: vi.fn(),
}))

describe('kitchenCollision', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the region directly under the pointer', () => {
    vi.mocked(pointerWithin).mockReturnValue(pointerCollisionMock)

    expect(kitchenCollision(kitchenCollisionArgumentsMock)).toEqual(
      pointerCollisionMock
    )
    expect(closestCorners).not.toHaveBeenCalled()
  })

  it('keeps the corner strategy for keyboard dragging', () => {
    vi.mocked(pointerWithin).mockReturnValue([])
    vi.mocked(closestCorners).mockReturnValue(cornerCollisionMock)

    expect(kitchenCollision(kitchenCollisionArgumentsMock)).toEqual(
      cornerCollisionMock
    )
  })
})
