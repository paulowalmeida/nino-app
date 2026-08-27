import { act,renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useCounterCart } from './useCounterCart'

const item = {
  id: 'item-1',
  name: 'Café',
  price: '10',
  description: null,
  position: 1,
  isActive: true,
  images: [],
  category: { id: 'drinks', name: 'Bebidas', position: 1 },
}

describe(useCounterCart.name, () => {
  it('adds, increments, decrements, and clears cart lines', () => {
    const { result } = renderHook(() => useCounterCart())
    act(() => result.current.add(item))
    act(() => result.current.add(item))
    act(() => result.current.add({ ...item, id: 'item-2', name: 'Bolo' }))
    act(() => result.current.add(item))
    expect(result.current.count).toBe(4)
    expect(result.current.total).toBe(40)
    act(() => result.current.step('item-1', -1))
    expect(result.current.count).toBe(3)
    act(() => result.current.step('item-1', -1))
    act(() => result.current.step('item-2', -1))
    act(() => result.current.step('item-1', -1))
    act(() => result.current.step('item-1', -1))
    expect(result.current.lines).toEqual([])
    act(() => result.current.clear())
    expect(result.current.count).toBe(0)
  })
})
