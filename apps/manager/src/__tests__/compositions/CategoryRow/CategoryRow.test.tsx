import type { ComponentProps } from 'react'

import { Reorder } from 'framer-motion'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { CategoryWithCount } from '@custom_types/product/category-with-count'
import { CategoryRow } from '@compositions/CategoryRow/CategoryRow'

import { buildCategory } from './CategoryRow.mock'

const renderRow = (
  category: CategoryWithCount,
  props: Partial<ComponentProps<typeof CategoryRow>> = {}
) =>
  render(
    <Reorder.Group as="ul" axis="y" values={[category]} onReorder={vi.fn()}>
      <CategoryRow
        category={category}
        index={0}
        isRenaming={false}
        disabled={false}
        onRename={vi.fn()}
        onDelete={vi.fn()}
        onDragEnd={vi.fn()}
        {...props}
      />
    </Reorder.Group>
  )

describe(CategoryRow.name, () => {
  it('shows the item count when the category has products', () => {
    // Arrange / Act
    renderRow(buildCategory({ count: 3 }))

    // Assert
    expect(screen.getByText('3 itens')).toBeInTheDocument()
  })

  it('flags an empty category instead of showing a count', () => {
    // Arrange / Act
    renderRow(buildCategory({ count: 0 }))

    // Assert
    expect(screen.getByText(/nenhum item ainda/i)).toBeInTheDocument()
  })

  it('saves a new name through onRename', async () => {
    // Arrange
    const onRename = vi.fn().mockResolvedValue(undefined)
    renderRow(buildCategory({ name: 'Bebidas' }), { onRename })

    // Act
    await userEvent.click(screen.getByLabelText('Renomear Bebidas'))
    const field = screen.getByLabelText('Novo nome para Bebidas')
    await userEvent.clear(field)
    await userEvent.type(field, 'Sucos')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    // Assert
    expect(onRename).toHaveBeenCalledWith('Sucos')
  })

  it('does not call onRename when the name is unchanged', async () => {
    // Arrange
    const onRename = vi.fn()
    renderRow(buildCategory({ name: 'Bebidas' }), { onRename })

    // Act
    await userEvent.click(screen.getByLabelText('Renomear Bebidas'))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    // Assert
    expect(onRename).not.toHaveBeenCalled()
  })

  it('triggers onDelete from the delete action', async () => {
    // Arrange
    const onDelete = vi.fn()
    renderRow(buildCategory({ name: 'Bebidas' }), { onDelete })

    // Act
    await userEvent.click(screen.getByLabelText('Excluir Bebidas'))

    // Assert
    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
