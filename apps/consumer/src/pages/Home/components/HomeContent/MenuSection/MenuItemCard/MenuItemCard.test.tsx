import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MenuItemCard } from './MenuItemCard'
import { menuItemCardMock } from './MenuItemCard.mock'
describe('MenuItemCard', () => {
  it('renders the item and add action', () => {
    render(
      <MenuItemCard
        item={menuItemCardMock.item as never}
        onAdd={vi.fn()}
        onSelect={vi.fn()}
        fallbackIcon={menuItemCardMock.fallbackIcon}
      />
    )
    expect(
      screen.getByRole('button', { name: 'Adicionar Hambúrguer' })
    ).toBeInTheDocument()
  })
})
