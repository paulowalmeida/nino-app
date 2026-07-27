import { Reorder } from 'framer-motion'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { CategoryWithCount } from './Categories.types'
import { CategoryRow } from './CategoryRow'

const build = (overrides: Partial<CategoryWithCount>): CategoryWithCount => ({
  id: 'cat-1',
  name: 'Bebidas',
  description: null,
  position: 0,
  tenantId: 'tenant-1',
  count: 3,
  ...overrides,
})

const renderRow = (
  category: CategoryWithCount,
  props: Partial<React.ComponentProps<typeof CategoryRow>> = {}
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
    renderRow(build({ count: 3 }))
    expect(screen.getByText('3 itens')).toBeInTheDocument()
  })

  it('flags an empty category instead of showing a count', () => {
    renderRow(build({ count: 0 }))
    expect(screen.getByText(/nenhum item ainda/i)).toBeInTheDocument()
  })

  it('saves a new name through onRename', async () => {
    const onRename = vi.fn().mockResolvedValue(undefined)
    renderRow(build({ name: 'Bebidas' }), { onRename })

    await userEvent.click(screen.getByLabelText('Renomear Bebidas'))
    const field = screen.getByLabelText('Novo nome para Bebidas')
    await userEvent.clear(field)
    await userEvent.type(field, 'Sucos')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onRename).toHaveBeenCalledWith('Sucos')
  })

  it('does not call onRename when the name is unchanged', async () => {
    const onRename = vi.fn()
    renderRow(build({ name: 'Bebidas' }), { onRename })

    await userEvent.click(screen.getByLabelText('Renomear Bebidas'))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onRename).not.toHaveBeenCalled()
  })

  it('triggers onDelete from the delete action', async () => {
    const onDelete = vi.fn()
    renderRow(build({ name: 'Bebidas' }), { onDelete })

    await userEvent.click(screen.getByLabelText('Excluir Bebidas'))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
