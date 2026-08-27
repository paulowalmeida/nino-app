import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CategoriesList } from '@pages/CatalogCategories/components/CategoriesList/CategoriesList'
import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'

vi.mock('@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade')
vi.mock('framer-motion', () => ({
  Reorder: {
    Group: ({ children }: { children: ReactNode }) => <ul>{children}</ul>,
  },
}))
vi.mock('@pages/CatalogCategories/components/CategoriesList/CategoryRow/CategoryRow', () => ({
  CategoryRow: ({ category, isRenaming, disabled, onRename, onDelete, onDragEnd }: {
    category: { id: string; name: string }
    isRenaming: boolean
    disabled: boolean
    onRename: (name: string) => Promise<void>
    onDelete: () => void
    onDragEnd: () => void
  }) => (
    <li>
      <span>{`${category.name}:${isRenaming}:${disabled}`}</span>
      <button onClick={() => void onRename('Novo nome')}>rename-{category.id}</button>
      <button onClick={onDelete}>delete-{category.id}</button>
      <button onClick={onDragEnd}>drag-{category.id}</button>
    </li>
  ),
}))

const rename = vi.fn().mockResolvedValue(undefined)
const requestDelete = vi.fn()
const persistOrder = vi.fn()

describe(CategoriesList.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCatalogCategoriesFacade).mockReturnValue({
      order: [
        { id: 'drinks', name: 'Bebidas' },
        { id: 'desserts', name: 'Sobremesas' },
      ],
      isDeleting: true,
      isRenaming: true,
      renamingId: 'drinks',
      setOrder: vi.fn(),
      persistOrder,
      rename,
      requestDelete,
    } as unknown as ReturnType<typeof useCatalogCategoriesFacade>)
  })

  it('maps category state and commands to each row', async () => {
    const user = userEvent.setup()
    render(<CategoriesList />)

    expect(screen.getByText('Bebidas:true:true')).toBeInTheDocument()
    expect(screen.getByText('Sobremesas:false:true')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'rename-drinks' }))
    await user.click(screen.getByRole('button', { name: 'delete-drinks' }))
    await user.click(screen.getByRole('button', { name: 'drag-drinks' }))

    expect(rename).toHaveBeenCalledWith({ id: 'drinks', name: 'Novo nome' })
    expect(requestDelete).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'drinks' })
    )
    expect(persistOrder).toHaveBeenCalledOnce()
  })
})
