import { afterEach, describe, expect, it } from 'vitest'

import { useProductChoicesStore } from './product-choices.state'
import { productChoicesStateMock } from './product-choices.state.mock'

const { productId, edit } = productChoicesStateMock

afterEach(() => useProductChoicesStore.getState().reset())

describe('useProductChoicesStore', () => {
  it('opens a line for editing with its choices, quantity and notes', () => {
    useProductChoicesStore.getState().openProduct(productId, edit)

    expect(useProductChoicesStore.getState()).toMatchObject({
      productId,
      editingLineId: edit.lineId,
      selections: edit.selections,
      quantity: 3,
      notes: 'Sem cebola',
    })
  })

  it('does not wipe an edit already open for the same line', () => {
    useProductChoicesStore.getState().openProduct(productId, edit)
    useProductChoicesStore.getState().setQuantity(5)
    useProductChoicesStore.getState().openProduct(productId, edit)

    expect(useProductChoicesStore.getState().quantity).toBe(5)
  })

  it('starts clean when opened for adding after an edit', () => {
    useProductChoicesStore.getState().openProduct(productId, edit)
    useProductChoicesStore.getState().openProduct(productId)

    expect(useProductChoicesStore.getState()).toMatchObject({
      editingLineId: null,
      selections: {},
      quantity: 1,
      notes: '',
    })
  })

  it('only allows quantity zero while editing', () => {
    useProductChoicesStore.getState().openProduct(productId)
    useProductChoicesStore.getState().setQuantity(0)
    expect(useProductChoicesStore.getState().quantity).toBe(1)

    useProductChoicesStore.getState().openProduct('other', edit)
    useProductChoicesStore.getState().setQuantity(0)
    expect(useProductChoicesStore.getState().quantity).toBe(0)
  })
})
