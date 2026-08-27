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
})
