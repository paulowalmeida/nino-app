import { describe, expect, it } from 'vitest'

import { nextStep } from './order-action-policy'
import { baseOrderMock } from './order-action-policy.mock'

describe('nextStep', () => {
  it('asks to confirm a pending order', () => {
    const step = nextStep({ ...baseOrderMock, status: 'PENDING' })
    expect(step).toEqual({ target: 'ACCEPTED', label: 'Confirmar pedido' })
  })

  it('asks to start preparing an accepted order', () => {
    const step = nextStep({ ...baseOrderMock, status: 'ACCEPTED' })
    expect(step).toEqual({
      target: 'PREPARING',
      label: 'Começar a preparar',
    })
  })

  it('sends a preparing delivery order out for delivery', () => {
    const step = nextStep({
      ...baseOrderMock,
      status: 'PREPARING',
      channel: 'DELIVERY',
    })
    expect(step?.target).toBe('OUT_FOR_DELIVERY')
  })

  it('marks a preparing pickup order ready for pickup', () => {
    const step = nextStep({
      ...baseOrderMock,
      status: 'PREPARING',
      channel: 'PICKUP',
    })
    expect(step?.target).toBe('READY_FOR_PICKUP')
  })

  it('marks an order out for delivery as delivered', () => {
    const step = nextStep({ ...baseOrderMock, status: 'OUT_FOR_DELIVERY' })
    expect(step?.target).toBe('DELIVERED')
  })

  it('marks a ready-for-pickup order as completed on pickup', () => {
    const step = nextStep({ ...baseOrderMock, status: 'READY_FOR_PICKUP' })
    expect(step?.target).toBe('COMPLETED')
  })

  it('has no next step for a finished or cancelled order', () => {
    expect(nextStep({ ...baseOrderMock, status: 'DELIVERED' })).toBeNull()
    expect(nextStep({ ...baseOrderMock, status: 'CANCELLED' })).toBeNull()
  })
})
