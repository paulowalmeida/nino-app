import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CatalogDeleteItemsDialog } from '@pages/Catalog/components/CatalogDeleteItemsDialog/CatalogDeleteItemsDialog'
import { useCatalogFacade } from '@pages/Catalog/facades/useCatalogFacade'

vi.mock('@pages/Catalog/facades/useCatalogFacade')
vi.mock('@nino/ds/components/Dialog', () => ({
  Dialog: ({
    open,
    onOpenChange,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
  }) => (
    <div>
      <button onClick={() => onOpenChange(false)}>fechar externamente</button>
      {open && <span>aberto</span>}
    </div>
  ),
}))

describe('CatalogDeleteItemsDialog behavior', () => {
  const close = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCatalogFacade).mockReturnValue({
      idsPendingDelete: ['item-1', 'item-2'],
      isDeletingItems: false,
      closeDeleteItems: close,
      deleteItems: vi.fn(),
    } as unknown as ReturnType<typeof useCatalogFacade>)
  })

  it('closes when dismissed externally', async () => {
    render(<CatalogDeleteItemsDialog />)

    await userEvent.click(
      screen.getByRole('button', { name: 'fechar externamente' })
    )

    expect(close).toHaveBeenCalledOnce()
  })
})
