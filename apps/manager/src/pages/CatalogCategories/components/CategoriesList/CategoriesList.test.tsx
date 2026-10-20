import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CategoriesList } from '@pages/CatalogCategories/components/CategoriesList/CategoriesList'
import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'

vi.mock(
  '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'
)
vi.mock('framer-motion', () => ({
  Reorder: {
    Group: ({
      children,
      onDragEnd,
      onReorder,
    }: {
      children: ReactNode
      onDragEnd: () => void
      onReorder: (order: { id: string }[]) => void
    }) => (
      <ul>
        {children}
        <button
          onClick={() => onReorder([{ id: 'desserts' }, { id: 'drinks' }])}
        >
          reorder
        </button>
        <button onClick={onDragEnd}>finish-drag</button>
      </ul>
    ),
  },
}))
vi.mock(
  '@pages/CatalogCategories/components/CategoriesList/CategoryRow/CategoryRow',
  () => ({
    CategoryRow: ({
      category,
      disabled,
      onEdit,
      onDelete,
    }: {
      category: { id: string; name: string }
      disabled: boolean
      onEdit: () => void
      onDelete: () => void
    }) => (
      <li>
        <span>{`${category.name}:${disabled}`}</span>
        <button onClick={onEdit}>edit-{category.id}</button>
        <button onClick={onDelete}>delete-{category.id}</button>
      </li>
    ),
  })
)

const requestEdit = vi.fn()
const requestDelete = vi.fn()
const persistOrder = vi.fn()
const setOrder = vi.fn()

describe(CategoriesList.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCatalogCategoriesFacade).mockReturnValue({
      order: [
        { id: 'drinks', name: 'Bebidas' },
        { id: 'desserts', name: 'Sobremesas' },
      ],
      isDeleting: true,
      setOrder,
      persistOrder,
      requestEdit,
      requestDelete,
    } as unknown as ReturnType<typeof useCatalogCategoriesFacade>)
  })

  it('maps category state and commands to each row', async () => {
    const user = userEvent.setup()
    render(<CategoriesList />)

    expect(screen.getByText('Bebidas:true')).toBeInTheDocument()
    expect(screen.getByText('Sobremesas:true')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'edit-drinks' }))
    await user.click(screen.getByRole('button', { name: 'delete-drinks' }))
    await user.click(screen.getByRole('button', { name: 'finish-drag' }))

    expect(requestEdit).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'drinks' })
    )
    expect(requestDelete).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'drinks' })
    )
    expect(persistOrder).toHaveBeenCalledOnce()
  })

  it('keeps the dragged order and persists exactly that order when the drag ends', async () => {
    const user = userEvent.setup()
    render(<CategoriesList />)

    await user.click(screen.getByRole('button', { name: 'reorder' }))
    await user.click(screen.getByRole('button', { name: 'finish-drag' }))

    expect(setOrder).toHaveBeenCalledWith([
      { id: 'desserts' },
      { id: 'drinks' },
    ])
    expect(persistOrder).toHaveBeenCalledWith([
      { id: 'desserts' },
      { id: 'drinks' },
    ])
  })
})
