import { beforeEach, describe, expect, it } from 'vitest'

import type { MenuItem } from '@shared/types/product/menu-item'

import { useCounterStore } from './counter.store'

const item: MenuItem = {
  id: 'item-1',
  name: 'Café',
  price: '10',
  description: null,
  position: 1,
  isActive: true,
  images: [],
  category: { id: 'drinks', name: 'Bebidas', position: 1 },
}

describe(useCounterStore.name, () => {
  beforeEach(() => {
    useCounterStore.getState().clear()
    useCounterStore.getState().clearLastSale()
  })

  it('adds products and increments an existing line', () => {
    useCounterStore.getState().add(item)
    useCounterStore.getState().add(item)

    expect(useCounterStore.getState().lines).toEqual([
      { productId: 'item-1', name: 'Café', unitPrice: '10', quantity: 2 },
    ])
  })

  it('steps quantities and removes lines at zero', () => {
    useCounterStore.getState().add(item)
    useCounterStore.getState().step(item.id, 1)
    expect(useCounterStore.getState().lines[0]?.quantity).toBe(2)

    useCounterStore.getState().step(item.id, -2)
    expect(useCounterStore.getState().lines).toEqual([])
  })

  it('stores checkout fields and resets the complete ticket', () => {
    const store = useCounterStore.getState()
    store.setSheet(true)
    store.setChosenPaymentMethod('PIX')
    store.setCustomerName('Ana')
    store.setTableNumber('4')

    expect(useCounterStore.getState()).toMatchObject({
      sheet: true,
      chosenPaymentMethod: 'PIX',
      customerName: 'Ana',
      tableNumber: '4',
    })

    store.clear()
    expect(useCounterStore.getState()).toMatchObject({
      lines: [],
      sheet: false,
      chosenPaymentMethod: null,
      customerName: '',
      tableNumber: '',
    })
  })

  it('remembers the receipt of the last closed sale until dismissed', () => {
    const store = useCounterStore.getState()

    store.setLastSale({
      orderNumber: 128,
      closedAt: '2026-08-30T12:00:00.000Z',
      lines: [],
      total: 20,
      paymentMethod: 'CASH',
      receivedAmount: 50,
      changeAmount: 30,
    })
    expect(useCounterStore.getState().lastSale?.orderNumber).toBe(128)

    store.clearLastSale()
    expect(useCounterStore.getState().lastSale).toBeNull()
  })

  it('dismisses the previous receipt once a new sale starts', () => {
    const store = useCounterStore.getState()
    store.setLastSale({
      orderNumber: 128,
      closedAt: '2026-08-30T12:00:00.000Z',
      lines: [],
      total: 20,
      paymentMethod: 'CASH',
      receivedAmount: 50,
      changeAmount: 30,
    })

    store.add(item)

    expect(useCounterStore.getState().lastSale).toBeNull()
  })

  it('keeps the receipt available after clearing the ticket', () => {
    const store = useCounterStore.getState()
    store.setLastSale({
      orderNumber: 128,
      closedAt: '2026-08-30T12:00:00.000Z',
      lines: [],
      total: 20,
      paymentMethod: 'CASH',
      receivedAmount: 50,
      changeAmount: 30,
    })

    store.clear()

    expect(useCounterStore.getState().lastSale?.orderNumber).toBe(128)
  })
})
