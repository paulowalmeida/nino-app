import { MemoryRouter } from 'react-router'

import { Reorder } from 'framer-motion'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { MenuItem } from '@custom_types/product/menu-item'
import { MenuRow } from '@molecules/MenuRow/MenuRow'

const build = (overrides: Partial<MenuItem> = {}): MenuItem => ({
  id: 'item-1',
  name: 'Coxinha',
  description: null,
  price: '8.50',
  position: 0,
  isActive: true,
  category: { id: 'cat-1', name: 'Salgados', position: 0 },
  images: [],
  ...overrides,
})

const renderRow = (
  item: MenuItem,
  props: Partial<React.ComponentProps<typeof MenuRow>> = {}
) =>
  render(
    <MemoryRouter>
      <Reorder.Group as="ul" axis="y" values={[item]} onReorder={vi.fn()}>
        <MenuRow
          item={item}
          index={0}
          canReorder={false}
          isSelecting={false}
          isSelected={false}
          onToggleSelect={vi.fn()}
          onToggleAvailability={vi.fn()}
          onDelete={vi.fn()}
          onDragEnd={vi.fn()}
          {...props}
        />
      </Reorder.Group>
    </MemoryRouter>
  )

describe(MenuRow.name, () => {
  it('hands the whole item to onDelete so the dialog can name it', async () => {
    // Arrange
    const onDelete = vi.fn()
    const item = build({ name: 'Coxinha' })
    renderRow(item, { onDelete })

    // Act
    await userEvent.click(screen.getByLabelText('Excluir Coxinha'))

    // Assert
    expect(onDelete).toHaveBeenCalledWith(item)
  })

  it('does not delete on its own — the row only asks', async () => {
    // Arrange
    const onToggleAvailability = vi.fn()
    renderRow(build(), { onToggleAvailability })

    // Act
    await userEvent.click(screen.getByLabelText('Excluir Coxinha'))

    // Assert
    expect(onToggleAvailability).not.toHaveBeenCalled()
  })

  it('shows a checkbox instead of the trash button while selecting', () => {
    // Arrange / Act
    renderRow(build(), { isSelecting: true })

    // Assert
    expect(screen.getByLabelText('Selecionar Coxinha')).toBeInTheDocument()
    expect(screen.queryByLabelText('Excluir Coxinha')).not.toBeInTheDocument()
  })

  it('reports the toggled item id when the checkbox is clicked', async () => {
    // Arrange
    const onToggleSelect = vi.fn()
    const item = build({ id: 'item-42' })
    renderRow(item, { isSelecting: true, onToggleSelect })

    // Act
    await userEvent.click(screen.getByLabelText('Selecionar Coxinha'))

    // Assert
    expect(onToggleSelect).toHaveBeenCalledWith('item-42')
  })
})
