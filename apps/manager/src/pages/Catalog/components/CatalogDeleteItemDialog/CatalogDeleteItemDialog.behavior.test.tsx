import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CatalogDeleteItemDialog } from '@pages/Catalog/components/CatalogDeleteItemDialog/CatalogDeleteItemDialog'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'

vi.mock('@pages/Catalog/facades/useCatalogFacade')
vi.mock('@nino/ds/components/Dialog', () => ({
  Dialog: ({
    open,
    onOpenChange,
    onConfirm,
    onCancel,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    onCancel: () => void
  }) => (
    <div>
      <button onClick={() => onOpenChange(false)}>fechar externamente</button>
      <button onClick={onConfirm}>confirmar</button>
      <button onClick={onCancel}>cancelar</button>
      {open && <span>aberto</span>}
    </div>
  ),
}))

describe('CatalogDeleteItemDialog behavior', () => {
  const close = vi.fn()
  const remove = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCatalogFacade).mockReturnValue({
      itemPendingDelete: null,
      isDeletingItem: false,
      closeDeleteItem: close,
      deleteItem: remove,
    } as unknown as ReturnType<typeof useCatalogFacade>)
  })

  it('closes when the dialog is dismissed externally', async () => {
    render(<CatalogDeleteItemDialog />)

    await userEvent.click(
      screen.getByRole('button', { name: 'fechar externamente' })
    )

    expect(close).toHaveBeenCalledOnce()
  })

  it('does not delete when confirmation has no pending item', async () => {
    render(<CatalogDeleteItemDialog />)

    await userEvent.click(screen.getByRole('button', { name: 'confirmar' }))

    expect(remove).not.toHaveBeenCalled()
  })
})
