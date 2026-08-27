import { MemoryRouter, useNavigate } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DeleteCategoryDialog } from '@pages/CatalogCategories/components/DeleteCategoryDialog/DeleteCategoryDialog'
import { CATEGORIES_HAS_PRODUCTS_HINT } from '@pages/CatalogCategories/constants/catalog-categories.constants'
import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'

vi.mock('@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade')
vi.mock('@nino/ds/components/Dialog', () => ({
  Dialog: ({
    open,
    title,
    description,
    confirmLabel,
    cancelLabel,
    onConfirm,
    onCancel,
    onOpenChange,
  }: {
    open?: boolean
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => void
    onCancel: () => void
    onOpenChange?: (open: boolean) => void
  }) => open ? (
    <div role="dialog">
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={onConfirm}>{confirmLabel}</button>
      <button onClick={onCancel}>{cancelLabel}</button>
      <button onClick={() => onOpenChange?.(false)}>dismiss</button>
      <button onClick={() => onOpenChange?.(true)}>keep-open</button>
    </div>
  ) : null,
}))
vi.mock('react-router', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-router')>()
  return { ...original, useNavigate: vi.fn() }
})

const closeDelete = vi.fn()
const confirmDelete = vi.fn().mockResolvedValue(undefined)
const navigate = vi.fn()
const category = {
  id: 'drinks',
  name: 'Bebidas',
  count: 0,
} as CategoryWithCount

const renderDialog = () => render(<MemoryRouter><DeleteCategoryDialog /></MemoryRouter>)

describe(DeleteCategoryDialog.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigate).mockReturnValue(navigate)
    vi.mocked(useCatalogCategoriesFacade).mockReturnValue({
      deleteTarget: category,
      isDeleting: false,
      deleteError: null,
      confirmDelete,
      closeDelete,
    } as unknown as ReturnType<typeof useCatalogCategoriesFacade>)
  })

  it('confirms deletion only for an empty category', async () => {
    const user = userEvent.setup()
    renderDialog()

    expect(screen.getByRole('heading', { name: 'Excluir "Bebidas"' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(confirmDelete).toHaveBeenCalledOnce()
  })

  it('redirects a populated category to its items instead of deleting', async () => {
    const user = userEvent.setup()
    vi.mocked(useCatalogCategoriesFacade).mockReturnValue({
      deleteTarget: { ...category, count: 2 },
      isDeleting: false,
      deleteError: null,
      confirmDelete,
      closeDelete,
    } as unknown as ReturnType<typeof useCatalogCategoriesFacade>)

    renderDialog()

    expect(screen.getByText(CATEGORIES_HAS_PRODUCTS_HINT)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ver itens no cardápio' }))

    expect(navigate).toHaveBeenCalledWith('..', { relative: 'path' })
    expect(confirmDelete).not.toHaveBeenCalled()
  })

  it('closes from either dialog and presents deletion errors', async () => {
    const user = userEvent.setup()
    vi.mocked(useCatalogCategoriesFacade).mockReturnValue({
      deleteTarget: category,
      isDeleting: false,
      deleteError: 'Não foi possível excluir',
      confirmDelete,
      closeDelete,
    } as unknown as ReturnType<typeof useCatalogCategoriesFacade>)

    renderDialog()

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível excluir')
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    await user.click(screen.getByRole('button', { name: 'dismiss' }))
    await user.click(screen.getByRole('button', { name: 'keep-open' }))
    expect(closeDelete).toHaveBeenCalled()
  })

  it('closes the populated-category dialog when dismissed', async () => {
    const user = userEvent.setup()
    vi.mocked(useCatalogCategoriesFacade).mockReturnValue({
      deleteTarget: { ...category, count: 1 },
      isDeleting: false,
      deleteError: null,
      confirmDelete,
      closeDelete,
    } as unknown as ReturnType<typeof useCatalogCategoriesFacade>)

    renderDialog()
    await user.click(screen.getByRole('button', { name: 'dismiss' }))
    await user.click(screen.getByRole('button', { name: 'keep-open' }))

    expect(closeDelete).toHaveBeenCalledOnce()
  })

  it('renders no open dialog without a target', () => {
    vi.mocked(useCatalogCategoriesFacade).mockReturnValue({
      deleteTarget: null,
      isDeleting: false,
      deleteError: null,
      confirmDelete,
      closeDelete,
    } as unknown as ReturnType<typeof useCatalogCategoriesFacade>)

    renderDialog()

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
