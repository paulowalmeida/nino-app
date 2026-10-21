import { MemoryRouter } from 'react-router'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTableTabsFacade } from '@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade'

import { TableTabsBoard } from './TableTabsBoard'
import { tableTabsBoardMock } from './TableTabsBoard.mock'

vi.mock('@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade')

const mockFacade = (overrides: Record<string, unknown> = {}) =>
  vi.mocked(useTableTabsFacade).mockReturnValue({
    activeTabs: tableTabsBoardMock.activeTabs,
    finalizedTabs: tableTabsBoardMock.finalizedTabs,
    isPending: false,
    isError: false,
    ...overrides,
  } as unknown as ReturnType<typeof useTableTabsFacade>)

const renderBoard = () =>
  render(
    <MemoryRouter>
      <TableTabsBoard />
    </MemoryRouter>
  )

describe('TableTabsBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFacade()
  })

  it('lists the tabs in progress first, with counts on both groups', () => {
    renderBoard()

    expect(screen.getByText('Mesa 4')).toBeInTheDocument()
    expect(screen.getByText('Mesa 7')).toBeInTheDocument()
    expect(screen.queryByText('Ana Souza')).not.toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: 'Em aberto (2)' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: 'Finalizadas (2)' })
    ).toBeInTheDocument()
  })

  it('switches to the finalized tabs', async () => {
    renderBoard()

    await userEvent.click(screen.getByRole('tab', { name: /Finalizadas/ }))

    expect(screen.getByTestId('tabs-chip-skeleton')).toBeInTheDocument()
    expect(screen.queryByText('Ana Souza')).not.toBeInTheDocument()
    expect(await screen.findByText('Ana Souza')).toBeInTheDocument()
    expect(screen.queryByText('Mesa 4')).not.toBeInTheDocument()
    await waitFor(() =>
      expect(screen.queryByTestId('tabs-chip-skeleton')).not.toBeInTheDocument()
    )

    await userEvent.click(screen.getByRole('tab', { name: /Em aberto/ }))

    expect(screen.getByTestId('tabs-chip-skeleton')).toBeInTheDocument()
    expect(await screen.findByText('Mesa 4')).toBeInTheDocument()
  })

  it('searches across both groups ignoring the selected one', async () => {
    renderBoard()

    await userEvent.type(
      screen.getByRole('searchbox', { name: tableTabsBoardMock.searchLabel }),
      'ana'
    )

    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
    expect(screen.queryByText('Mesa 4')).not.toBeInTheDocument()
  })

  it('says when the search finds nothing', async () => {
    renderBoard()

    await userEvent.type(
      screen.getByRole('searchbox', { name: tableTabsBoardMock.searchLabel }),
      'zzz'
    )

    expect(
      screen.getByText('Nenhuma comanda encontrada para esta busca.')
    ).toBeInTheDocument()
  })

  it.each([
    ['em aberto', { activeTabs: [] }, 'Nenhuma comanda em aberto.'],
    ['finalizadas', { finalizedTabs: [] }, 'Nenhuma comanda finalizada.'],
  ])('says when there is no tab %s', async (_group, overrides, message) => {
    mockFacade(overrides)
    renderBoard()

    if (message.includes('finalizada')) {
      await userEvent.click(screen.getByRole('tab', { name: /Finalizadas/ }))
    }

    expect(screen.getByText(message)).toBeInTheDocument()
  })

  it('shows the loading skeleton while the lists are pending', () => {
    mockFacade({ isPending: true })
    renderBoard()

    expect(screen.getByRole('status')).toHaveTextContent('Carregando comandas')
    expect(screen.queryByText('Mesa 4')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('searchbox', {
        name: tableTabsBoardMock.searchLabel,
      })
    ).not.toBeInTheDocument()
  })

  it('asks to try again when the lists fail', () => {
    mockFacade({ isError: true })
    renderBoard()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível carregar as comandas.'
    )
    expect(screen.queryByText('Mesa 4')).not.toBeInTheDocument()
  })
})
