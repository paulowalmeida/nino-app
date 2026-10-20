import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'

import { TabActions } from './TabActions'
import { tabActionsMock } from './TabActions.mock'

vi.mock(
  '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
)
vi.mock(
  '@pages/TableTabDetail/components/TabActions/TabPaymentForm/TabPaymentForm',
  () => ({ TabPaymentForm: () => <div>formulário de pagamento</div> })
)
vi.mock(
  '@pages/TableTabDetail/components/TabActions/TabFinalizedSummary/TabFinalizedSummary',
  () => ({ TabFinalizedSummary: () => <div>resumo da comanda</div> })
)
vi.mock(
  '@pages/TableTabDetail/components/TabActions/CancelTabDialog/CancelTabDialog',
  () => ({
    CancelTabDialog: ({
      open,
      onClose,
    }: {
      open: boolean
      onClose: () => void
    }) =>
      open ? (
        <button type="button" onClick={onClose}>
          fechar cancelamento
        </button>
      ) : null,
  })
)

const mockFacade = (overrides: Record<string, unknown>) => {
  const commands = { submitClose: vi.fn(), submitReopen: vi.fn() }
  vi.mocked(useTableTabDetailFacade).mockReturnValue({
    tab: tabActionsMock.openTab,
    canCancelTab: false,
    isClosing: false,
    isReopening: false,
    ...commands,
    ...overrides,
  } as unknown as ReturnType<typeof useTableTabDetailFacade>)
  return commands
}

describe('TabActions', () => {
  beforeEach(() => vi.clearAllMocks())

  it('closes an open tab only after confirming', async () => {
    const { submitClose } = mockFacade({})
    render(<TabActions />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Fechar comanda' })
    )
    await userEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Fechar comanda',
      })
    )

    expect(submitClose).toHaveBeenCalledOnce()
    expect(
      screen.queryByText('formulário de pagamento')
    ).not.toBeInTheDocument()
  })

  it('keeps the tab open when the close confirmation is declined', async () => {
    const { submitClose } = mockFacade({})
    render(<TabActions />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Fechar comanda' })
    )
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(submitClose).not.toHaveBeenCalled()
  })

  it('keeps the tab open when the close confirmation is dismissed', async () => {
    const { submitClose } = mockFacade({})
    render(<TabActions />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Fechar comanda' })
    )
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))

    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Fechar a comanda?' })
      ).not.toBeInTheDocument()
    )
    expect(submitClose).not.toHaveBeenCalled()
  })

  it('offers payment and reopening once the tab is closed', async () => {
    const { submitReopen } = mockFacade({
      tab: tabActionsMock.awaitingPaymentTab,
    })
    render(<TabActions />)

    expect(screen.getByText('formulário de pagamento')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Fechar comanda' })
    ).not.toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Reabrir comanda' })
    )

    expect(submitReopen).toHaveBeenCalledOnce()
  })

  it('offers the cancellation to staff too, who will need a manager', () => {
    mockFacade({ canCancelTab: false })
    render(<TabActions />)

    expect(
      screen.getByRole('button', { name: 'Cancelar comanda' })
    ).toBeInTheDocument()
  })

  it('lets a manager open and dismiss the cancellation', async () => {
    mockFacade({ canCancelTab: true })
    render(<TabActions />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Cancelar comanda' })
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'fechar cancelamento' })
    )

    expect(
      screen.queryByRole('button', { name: 'fechar cancelamento' })
    ).not.toBeInTheDocument()
  })

  it('shows the busy state of closing and reopening', () => {
    mockFacade({ isClosing: true })
    const { unmount } = render(<TabActions />)

    expect(screen.getByRole('button', { name: 'Fechar comanda' })).toBeEnabled()
    unmount()

    mockFacade({ tab: tabActionsMock.awaitingPaymentTab, isReopening: true })
    render(<TabActions />)

    expect(screen.getByRole('button', { name: /Carregando/ })).toHaveAttribute(
      'aria-busy',
      'true'
    )
  })

  it('shows only the summary of a finalized tab', () => {
    mockFacade({ tab: tabActionsMock.paidTab, canCancelTab: true })
    render(<TabActions />)

    expect(screen.getByText('resumo da comanda')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Cancelar comanda' })
    ).not.toBeInTheDocument()
  })

  it('renders nothing while the tab is unknown', () => {
    mockFacade({ tab: undefined })

    const { container } = render(<TabActions />)

    expect(container).toBeEmptyDOMElement()
  })
})
