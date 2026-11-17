import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { MenuItem } from '@custom_types/menu/menu-item'

import { MenuSearchResult } from './MenuSearchResult'
import { menuSearchResultMock } from './MenuSearchResult.mock'

const item = menuSearchResultMock.item as unknown as MenuItem

const renderRow = (props = {}) => {
  const onSelect = vi.fn()
  const onAdd = vi.fn()
  render(
    <ul>
      <MenuSearchResult
        item={item}
        categoryName={menuSearchResultMock.categoryName}
        query={menuSearchResultMock.query}
        onSelect={onSelect}
        onAdd={onAdd}
        {...props}
      />
    </ul>
  )
  return { onSelect, onAdd }
}

describe('MenuSearchResult', () => {
  it('highlights the matched part of the name', () => {
    renderRow()
    expect(screen.getByText('Pão').tagName).toBe('MARK')
  })

  it('opens the product', () => {
    const { onSelect } = renderRow()
    fireEvent.click(screen.getByRole('button', { name: /Ver detalhes/ }))
    expect(onSelect).toHaveBeenCalledWith(item)
  })

  it('adds from the quick button', () => {
    const { onAdd } = renderRow()
    fireEvent.click(screen.getByRole('button', { name: /Adicionar/ }))
    expect(onAdd).toHaveBeenCalledWith(item)
  })

  it('blocks adding when the store is closed', () => {
    renderRow({ disabled: true })
    expect(screen.getByRole('button', { name: /Adicionar/ })).toBeDisabled()
  })
})
