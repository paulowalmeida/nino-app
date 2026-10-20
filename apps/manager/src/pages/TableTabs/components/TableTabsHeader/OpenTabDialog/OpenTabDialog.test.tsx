import { MemoryRouter, Route, Routes, useLocation } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTableTabsFacade } from '@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade'

import { OpenTabDialog } from './OpenTabDialog'
import { openTabDialogMock } from './OpenTabDialog.mock'

vi.mock('@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade')

const Location = () => <p>{useLocation().pathname}</p>

const renderDialog = (onClose = vi.fn()) =>
  render(
    <MemoryRouter initialEntries={['/comandas']}>
      <Routes>
        <Route
          path="/comandas"
          element={<OpenTabDialog open onClose={onClose} />}
        />
        <Route path="/comandas/:tabId" element={<Location />} />
      </Routes>
    </MemoryRouter>
  )

const mockFacade = (overrides: Record<string, unknown> = {}) => {
  const submitOpen = vi.fn()
  vi.mocked(useTableTabsFacade).mockReturnValue({
    submitOpen,
    isOpening: false,
    diningTableSeats: openTabDialogMock.seats,
    isLoadingSeats: false,
    ...overrides,
  } as unknown as ReturnType<typeof useTableTabsFacade>)
  return submitOpen
}

describe('OpenTabDialog', () => {
  beforeEach(() => vi.clearAllMocks())

  it('keeps the confirm action disabled until the tab has a label', async () => {
    mockFacade()
    renderDialog()

    const confirm = screen.getByRole('button', { name: 'Abrir pelo nome' })
    expect(confirm).toBeDisabled()

    await userEvent.type(
      screen.getByRole('textbox', { name: /Comanda sem mesa/ }),
      openTabDialogMock.label
    )

    expect(confirm).toBeEnabled()
  })

  it('opens the tab with a trimmed label and goes to its detail', async () => {
    const submitOpen = mockFacade()
    submitOpen.mockImplementation((_request, options) =>
      options.onSuccess(openTabDialogMock.openedTab)
    )
    const onClose = vi.fn()
    renderDialog(onClose)

    await userEvent.type(
      screen.getByRole('textbox', { name: /Comanda sem mesa/ }),
      openTabDialogMock.paddedLabel
    )
    await userEvent.click(screen.getByRole('button', { name: 'Abrir pelo nome' }))

    expect(submitOpen).toHaveBeenCalledWith(
      { label: openTabDialogMock.label },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(onClose).toHaveBeenCalled()
    expect(
      await screen.findByText(openTabDialogMock.navigationTarget)
    ).toBeInTheDocument()
  })

  it('does not submit a blank label', async () => {
    const submitOpen = mockFacade()
    renderDialog()

    await userEvent.type(
      screen.getByRole('textbox', { name: /Comanda sem mesa/ }),
      '   {Enter}'
    )

    expect(submitOpen).not.toHaveBeenCalled()
  })

  it('goes straight to the tab already open at an occupied table', async () => {
    const submitOpen = mockFacade()
    const onClose = vi.fn()
    renderDialog(onClose)

    await userEvent.click(
      screen.getByRole('button', { name: 'Mesa 4, comanda aberta: ver comanda' })
    )

    expect(submitOpen).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
    expect(await screen.findByText('/comandas/tab-1')).toBeInTheDocument()
  })

  it('closes without opening when the person cancels', async () => {
    const submitOpen = mockFacade()
    const onClose = vi.fn()
    renderDialog(onClose)

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onClose).toHaveBeenCalled()
    expect(submitOpen).not.toHaveBeenCalled()
  })

  it('closes when the dialog is dismissed from outside', async () => {
    mockFacade()
    const onClose = vi.fn()
    renderDialog(onClose)

    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(onClose).toHaveBeenCalled()
  })

  it('shows the loading state on the confirm action while opening', () => {
    mockFacade({ isOpening: true })
    renderDialog()

    const confirm = screen.getByRole('button', { name: /Carregando/ })
    expect(confirm).toBeDisabled()
    expect(confirm).toHaveAttribute('aria-busy', 'true')
  })
})
