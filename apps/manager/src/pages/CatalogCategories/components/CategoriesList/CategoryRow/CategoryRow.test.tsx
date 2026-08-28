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
    Item: ({
      children,
      onAnimationEnd,
      ...props
    }: HTMLAttributes<HTMLLIElement>) => {
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
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onDragEnd: vi.fn(),
    disabled: false,
    ...overrides,
  }

  return {
    ...render(
      <ul>
        <CategoryRow {...props} />
      </ul>
    ),
    props,
  }
}

describe(CategoryRow.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('presents category count and exposes row actions', async () => {
    const user = userEvent.setup()
    const { props } = renderRow()

    expect(screen.getByText('2 itens')).toBeInTheDocument()
    fireEvent.pointerDown(
      screen.getByRole('button', { name: 'Reordenar Bebidas' })
    )
    await user.click(screen.getByRole('button', { name: 'Excluir Bebidas' }))
    await user.click(screen.getByRole('button', { name: 'Renomear Bebidas' }))

    expect(startDrag).toHaveBeenCalled()
    expect(props.onDelete).toHaveBeenCalledOnce()
    expect(props.onEdit).toHaveBeenCalledOnce()
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
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onDragEnd={vi.fn()}
          disabled={false}
        />
      </ul>
    )
    expect(screen.getByText('Vazia — nenhum item ainda')).toBeInTheDocument()
  })

  it('disables row actions while a mutation is in flight', () => {
    renderRow({ disabled: true })

    expect(
      screen.getByRole('button', { name: 'Renomear Bebidas' })
    ).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Excluir Bebidas' })
    ).toBeDisabled()
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
