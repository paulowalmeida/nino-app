import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { MenuItem } from '@custom_types/menu/menu-item'

import { MenuSearchResult } from './MenuSearchResult'
import { menuSearchResultMock } from './MenuSearchResult.mock'

const item = menuSearchResultMock.item as unknown as MenuItem

const renderRow = (props = {}) => {
  const onSelect = vi.fn()
  render(
    <ul>
      <MenuSearchResult
        item={item}
        categoryName={menuSearchResultMock.categoryName}
        query={menuSearchResultMock.query}
        onSelect={onSelect}
        {...props}
      />
    </ul>
  )
  return { onSelect }
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
})
