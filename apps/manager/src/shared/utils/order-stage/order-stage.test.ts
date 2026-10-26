import { describe, expect, it } from 'vitest'

import { isOpen, stageOf, statusesForStage } from './order-stage'

describe('order-stage', () => {
  it('stageOf maps an incoming order status to the incoming stage', () => {
    expect(stageOf('PENDING')).toBe('incoming')
  })

  it('stageOf maps every terminal status to the closed stage', () => {
    expect(stageOf('DELIVERED')).toBe('closed')
    expect(stageOf('COMPLETED')).toBe('closed')
    expect(stageOf('CANCELLED')).toBe('closed')
  })

  it('isOpen treats any non-closed stage as open', () => {
    expect(isOpen('PREPARING')).toBe(true)
  })

  it('isOpen treats a closed stage as not open', () => {
    expect(isOpen('COMPLETED')).toBe(false)
  })

  it('statusesForStage lists every status mapped to a stage', () => {
    expect(statusesForStage('closed')).toEqual([
      'DELIVERED',
      'COMPLETED',
      'CANCELLED',
    ])
  })
})
