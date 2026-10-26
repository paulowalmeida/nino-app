import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MenuItemCard } from './MenuItemCard'
import { menuItemCardMock } from './MenuItemCard.mock'

vi.mock('@hooks/useStoreCatalog/useStoreCatalog', () => ({
  useStoreCatalog: () => ({
    itemStyle: 'side-image',
    imageRatio: '4:3',
    density: 'comfortable',
    showDescription: true,
  }),
}))

describe('MenuItemCard', () => {
  it('renders the item and add action', () => {
    render(
      <MenuItemCard
        item={menuItemCardMock.item as never}
        onAdd={vi.fn()}
        onSelect={vi.fn()}
      />
    )
    expect(
      screen.getByRole('button', { name: 'Adicionar Hambúrguer' })
    ).toBeInTheDocument()
  })

  it('does not render an image placeholder when the item has no photo', () => {
    render(
      <MenuItemCard
        item={menuItemCardMock.item as never}
        onAdd={vi.fn()}
        onSelect={vi.fn()}
      />
    )

    expect(screen.queryByText('🍽️')).not.toBeInTheDocument()
  })

  it('keeps the add action separate from opening item details', () => {
    const onAdd = vi.fn()
    const onSelect = vi.fn()

    render(
      <MenuItemCard
        item={menuItemCardMock.item as never}
        onAdd={onAdd}
        onSelect={onSelect}
      />
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Adicionar Hambúrguer' })
    )

    expect(onAdd).toHaveBeenCalledOnce()
    expect(onSelect).not.toHaveBeenCalled()
  })
})
