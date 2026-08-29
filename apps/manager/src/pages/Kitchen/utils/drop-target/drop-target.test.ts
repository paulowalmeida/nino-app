import { describe, expect, it } from 'vitest'

import { dropTarget } from './drop-target'
import { dropTargetOrderMock } from './drop-target.mock'

describe('dropTarget', () => {
  it('allows moving a preparing order to waiting', () => {
    expect(dropTarget(dropTargetOrderMock, 'waiting')).toBe('ACCEPTED')
  })

  it('allows pickup orders to leave the kitchen', () => {
    expect(dropTarget(dropTargetOrderMock, 'finished')).toBe('READY_FOR_PICKUP')
  })

  it('rejects a status that cannot enter the selected stage', () => {
    const order = { ...dropTargetOrderMock, status: 'ACCEPTED' as const }

    expect(dropTarget(order, 'finished')).toBeNull()
  })
})
