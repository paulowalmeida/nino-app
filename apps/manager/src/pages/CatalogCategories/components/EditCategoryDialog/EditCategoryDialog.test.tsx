import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EditCategoryDialog } from '@pages/CatalogCategories/components/EditCategoryDialog/EditCategoryDialog'
import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'
import type { CategoryWithCount } from '@shared/types/product/category-with-count'

vi.mock(
  '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'
)
vi.mock('@nino/ds/components/Modal', () => ({
  Modal: ({
    open,
    header,
    body,
    footer,
    onOpenChange,
  }: {
    open?: boolean
    header?: React.ReactNode
    body?: React.ReactNode
    footer?: React.ReactNode
    onOpenChange?: (open: boolean) => void
  }) =>
    open ? (
      <div role="dialog">
        {header}
        {body}
        {footer}
        <button onClick={() => onOpenChange?.(false)}>dismiss</button>
      </div>
    ) : null,
}))

const setEditName = vi.fn()
const setEditIcon = vi.fn()
const submitEdit = vi.fn().mockResolvedValue(undefined)
const closeEdit = vi.fn()
const category = {
  id: 'drinks',
  name: 'Bebidas',
  count: 2,
} as CategoryWithCount

const mockFacade = (overrides: Record<string, unknown> = {}) =>
  vi.mocked(useCatalogCategoriesFacade).mockReturnValue({
    editTarget: category,
    editName: 'Bebidas',
    editIcon: null,
    isRenaming: false,
    setEditName,
    setEditIcon,
    submitEdit,
    closeEdit,
    ...overrides,
  } as unknown as ReturnType<typeof useCatalogCategoriesFacade>)

describe(EditCategoryDialog.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFacade()
  })

  it('renders no open dialog without a target', () => {
    mockFacade({ editTarget: null })
    render(<EditCategoryDialog />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('prefills the name and submits the trimmed edit', async () => {
    const user = userEvent.setup()
    render(<EditCategoryDialog />)

    const input = screen.getByRole('textbox', { name: 'Nome da categoria' })
    expect(input).toHaveValue('Bebidas')

    await user.type(input, 's')
    expect(setEditName).toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(submitEdit).toHaveBeenCalledOnce()
  })

  it('disables saving with a blank name and shows loading while renaming', () => {
    mockFacade({ editName: '   ', isRenaming: true })
    render(<EditCategoryDialog />)

    expect(screen.getByRole('button', { name: 'Carregando' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
  })

  it('closes from the cancel action and from dismissing the modal', async () => {
    const user = userEvent.setup()
    render(<EditCategoryDialog />)

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    await user.click(screen.getByRole('button', { name: 'dismiss' }))

    expect(closeEdit).toHaveBeenCalledTimes(2)
  })
})
