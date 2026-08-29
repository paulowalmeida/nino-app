import { describe, expect, it } from 'vitest'

import { nextStep, previousStep } from './order-action-policy'
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

describe('previousStep', () => {
  it('sends a preparing order back to the queue', () => {
    const step = previousStep({ ...baseOrderMock, status: 'PREPARING' })
    expect(step).toEqual({ target: 'ACCEPTED', label: 'Voltar para a fila' })
  })

  it('pulls an order back from the street into preparation', () => {
    const step = previousStep({ ...baseOrderMock, status: 'OUT_FOR_DELIVERY' })
    expect(step?.target).toBe('PREPARING')
  })

  it('pulls an order back from the counter into preparation', () => {
    const step = previousStep({ ...baseOrderMock, status: 'READY_FOR_PICKUP' })
    expect(step?.target).toBe('PREPARING')
  })

  it('never undoes the acceptance itself', () => {
    expect(previousStep({ ...baseOrderMock, status: 'ACCEPTED' })).toBeNull()
    expect(previousStep({ ...baseOrderMock, status: 'PENDING' })).toBeNull()
  })

  it('never undoes a terminal order', () => {
    expect(previousStep({ ...baseOrderMock, status: 'DELIVERED' })).toBeNull()
    expect(previousStep({ ...baseOrderMock, status: 'COMPLETED' })).toBeNull()
    expect(previousStep({ ...baseOrderMock, status: 'CANCELLED' })).toBeNull()
  })
})
