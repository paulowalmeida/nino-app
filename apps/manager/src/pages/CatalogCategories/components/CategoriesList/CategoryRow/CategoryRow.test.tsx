import type {
  AnimationEvent as ReactAnimationEvent,
  ComponentProps,
  HTMLAttributes,
} from 'react'

import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CategoryRow } from '@pages/CatalogCategories/components/CategoriesList/CategoryRow/CategoryRow'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'

const startDrag = vi.fn()
const motionEvents = vi.hoisted(() => ({
  onAnimationEnd: undefined as
    | ((event: ReactAnimationEvent<HTMLLIElement>) => void)
    | undefined,
}))

vi.mock('framer-motion', () => ({
  Reorder: {
    Item: ({ children, onAnimationEnd, ...props }: HTMLAttributes<HTMLLIElement>) => {
      motionEvents.onAnimationEnd = onAnimationEnd
      return <li {...props}>{children}</li>
    },
  },
  useDragControls: () => ({ start: startDrag }),
}))

const category = {
  id: 'drinks',
  name: 'Bebidas',
  count: 2,
} as CategoryWithCount

const renderRow = (
  overrides: Partial<ComponentProps<typeof CategoryRow>> = {}
) => {
  const props = {
    category,
    index: 0,
    isRenaming: false,
    onRename: vi.fn().mockResolvedValue(undefined),
    onDelete: vi.fn(),
    onDragEnd: vi.fn(),
    disabled: false,
    ...overrides,
  }

  return { ...render(<ul><CategoryRow {...props} /></ul>), props }
}

describe(CategoryRow.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('presents category count and exposes row actions', async () => {
    const user = userEvent.setup()
    const { props } = renderRow()

    expect(screen.getByText('2 itens')).toBeInTheDocument()
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Reordenar Bebidas' }))
    await user.click(screen.getByRole('button', { name: 'Excluir Bebidas' }))

    expect(startDrag).toHaveBeenCalled()
    expect(props.onDelete).toHaveBeenCalledOnce()
  })

  it('uses singular and empty count guidance', () => {
    const { rerender } = renderRow({
      category: { ...category, count: 1 },
    })
    expect(screen.getByText('1 item')).toBeInTheDocument()

    rerender(
      <ul>
        <CategoryRow
          category={{ ...category, count: 0 }}
          index={0}
          isRenaming={false}
          onRename={vi.fn()}
          onDelete={vi.fn()}
          onDragEnd={vi.fn()}
          disabled={false}
        />
      </ul>
    )
    expect(screen.getByText('Vazia — nenhum item ainda')).toBeInTheDocument()
  })

  it('renames a category after trimming the edited value', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn().mockResolvedValue(undefined)
    renderRow({ onRename })

    await user.click(screen.getByRole('button', { name: 'Renomear Bebidas' }))
    const input = screen.getByRole('textbox', { name: 'Novo nome para Bebidas' })
    await user.clear(input)
    await user.type(input, '  Geladas  ')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onRename).toHaveBeenCalledWith('Geladas')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('cancels empty, unchanged, explicit, and Escape edits', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    renderRow({ onRename })

    await user.click(screen.getByRole('button', { name: 'Renomear Bebidas' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(onRename).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Renomear Bebidas' }))
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await user.click(screen.getByRole('button', { name: 'Renomear Bebidas' }))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    await user.click(screen.getByRole('button', { name: 'Renomear Bebidas' }))
    await user.keyboard('{Escape}')

    expect(onRename).not.toHaveBeenCalled()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('keeps editing open when renaming fails and disables row actions as requested', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn().mockRejectedValue(new Error('offline'))
    renderRow({ onRename, disabled: true, isRenaming: true })

    expect(screen.getByRole('button', { name: 'Renomear Bebidas' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Excluir Bebidas' })).toBeDisabled()

    renderRow({ onRename })
    const renameButtons = screen.getAllByRole('button', { name: 'Renomear Bebidas' })
    await user.click(renameButtons[1])
    const inputs = screen.getAllByRole('textbox')
    await user.clear(inputs[0])
    await user.type(inputs[0], 'Geladas')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('finishes entrance animation only for the row itself and forwards drag end', () => {
    const { props } = renderRow()
    const row = screen.getByRole('listitem')

    act(() => {
      motionEvents.onAnimationEnd?.({
        target: screen.getByText('Bebidas'),
        currentTarget: row,
      } as unknown as ReactAnimationEvent<HTMLLIElement>)
      motionEvents.onAnimationEnd?.({
        target: row,
        currentTarget: row,
      } as unknown as ReactAnimationEvent<HTMLLIElement>)
    })
    fireEvent.dragEnd(row)

    expect(props.onDragEnd).toHaveBeenCalledOnce()
  })
})
