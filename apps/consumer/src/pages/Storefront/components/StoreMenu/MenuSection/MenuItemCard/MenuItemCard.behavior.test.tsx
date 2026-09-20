import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MenuItemCard } from './MenuItemCard'
import {
  describedMenuItemMock,
  menuItemCardMock,
} from './MenuItemCard.mock'

vi.mock('@hooks/useStoreCatalog/useStoreCatalog', () => ({
  useStoreCatalog: () => ({
    itemStyle: 'big-image',
    imageRatio: '16:9',
    density: 'compact',
    showDescription: false,
  }),
}))

describe('MenuItemCard', () => {
  it('wears the presentation the store published', () => {
    render(
      <MenuItemCard
        item={menuItemCardMock.item as never}
        onAdd={vi.fn()}
        onSelect={vi.fn()}
      />
    )

    const card = screen.getByRole('group')

    expect(card).toHaveAttribute('data-item-style', 'big-image')
    expect(card).toHaveAttribute('data-image-ratio', '16:9')
    expect(card).toHaveAttribute('data-density', 'compact')
  })

  it('hides the description when the store turned it off', () => {
    render(
      <MenuItemCard
        item={describedMenuItemMock as never}
        onAdd={vi.fn()}
        onSelect={vi.fn()}
      />
    )

    expect(
      screen.queryByText('Massa fina, molho da casa e manjericão fresco.')
    ).toBeNull()
  })
})
