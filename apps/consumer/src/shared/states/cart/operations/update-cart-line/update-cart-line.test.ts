import { describe, expect, it } from 'vitest'

import { addCartItem } from '../add-cart-item/add-cart-item'
import { updateCartLine } from './update-cart-line'
import { updateCartLineMock } from './update-cart-line.mock'

const { plain, withBacon } = updateCartLineMock

describe('updateCartLine', () => {
  it('replaces the line under its new key with the new quantity', () => {
    const lines = addCartItem({}, plain, 1)

    const result = updateCartLine(lines, 'item-1', withBacon, 3)

    expect(Object.keys(result)).toEqual(['item-1|baconx1|Sem cebola'])
    expect(Object.values(result)[0]).toMatchObject({
      item: withBacon,
      quantity: 3,
    })
  })

  it('sums into an existing line when the new key already exists', () => {
    const lines = addCartItem(addCartItem({}, plain, 1), withBacon, 2)

    const result = updateCartLine(lines, 'item-1', withBacon, 1)

    expect(Object.keys(result)).toEqual(['item-1|baconx1|Sem cebola'])
    expect(Object.values(result)[0].quantity).toBe(3)
  })

  it('removes the line when the quantity is zero', () => {
    const lines = addCartItem({}, plain, 2)

    expect(updateCartLine(lines, 'item-1', plain, 0)).toEqual({})
  })

  it('keeps the cart untouched when the line does not exist', () => {
    const lines = addCartItem({}, plain, 1)

    expect(updateCartLine(lines, 'missing', withBacon, 1)).toBe(lines)
  })
})
