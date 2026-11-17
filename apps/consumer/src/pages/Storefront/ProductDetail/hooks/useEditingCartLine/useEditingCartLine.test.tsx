import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'

import { useCartStore } from '@shared/states/cart/cart.state'

import { useEditingCartLine } from './useEditingCartLine'
import { useEditingCartLineMock } from './useEditingCartLine.mock'

const { line } = useEditingCartLineMock

const renderEditing = (productId: string, search: string) =>
  renderHook(() => useEditingCartLine(productId), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[`/produto/${productId}${search}`]}>
        {children}
      </MemoryRouter>
    ),
  })

const seedCart = (lineItem = line) =>
  useCartStore.setState({
    unitId: 'store-1',
    lines: { [lineItem.id]: lineItem },
  })

afterEach(() => useCartStore.getState().clear())

describe('useEditingCartLine', () => {
  it('returns the cart line named by the route param', () => {
    seedCart()

    const { result } = renderEditing(
      'item-1',
      `?linha=${encodeURIComponent(line.id)}`
    )

    expect(result.current).toEqual(line)
  })

  it('ignores package lines, unknown lines and other products', () => {
    seedCart({ ...line, item: { ...line.item, package: {} as never } })
    const param = `?linha=${encodeURIComponent(line.id)}`

    expect(renderEditing('item-1', param).result.current).toBeNull()

    seedCart()

    expect(renderEditing('item-2', param).result.current).toBeNull()
    expect(renderEditing('item-1', '?linha=missing').result.current).toBeNull()
    expect(renderEditing('item-1', '').result.current).toBeNull()
  })
})
