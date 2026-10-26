import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTableTabsFacade } from '@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade'

import { TableTabsHeader } from './TableTabsHeader'
import { tableTabsHeaderMock } from './TableTabsHeader.mock'

vi.mock(
  '@pages/TableTabs/components/TableTabsHeader/OpenTabDialog/OpenTabDialog',
  () => ({
    OpenTabDialog: ({
      open,
      onClose,
    }: {
      open: boolean
      onClose: () => void
    }) =>
      open ? (
        <button type="button" onClick={onClose}>
          fechar diálogo
        </button>
      ) : null,
  })
)
vi.mock('@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade')

describe('TableTabsHeader', () => {
  beforeEach(() => {
    vi.mocked(useTableTabsFacade).mockReturnValue({
      isPending: false,
    } as ReturnType<typeof useTableTabsFacade>)
  })

  it('titles the screen and offers to open a tab', () => {
    render(<TableTabsHeader />, { wrapper: MemoryRouter })

    expect(
      screen.getByRole('heading', { name: tableTabsHeaderMock.title })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: tableTabsHeaderMock.openLabel })
    ).toBeInTheDocument()
  })

  it('opens and closes the dialog for a new tab', async () => {
    render(<TableTabsHeader />, { wrapper: MemoryRouter })

    await userEvent.click(
      screen.getByRole('button', { name: tableTabsHeaderMock.openLabel })
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'fechar diálogo' })
    )

    expect(
      screen.queryByRole('button', { name: 'fechar diálogo' })
    ).not.toBeInTheDocument()
  })

  it('keeps the page header as a skeleton while tabs are loading', () => {
    vi.mocked(useTableTabsFacade).mockReturnValue({
      isPending: true,
    } as ReturnType<typeof useTableTabsFacade>)

    render(<TableTabsHeader />, { wrapper: MemoryRouter })

    expect(screen.getByRole('status')).toHaveTextContent('Carregando comandas')
    expect(
      screen.queryByRole('heading', { name: tableTabsHeaderMock.title })
    ).not.toBeInTheDocument()
  })
})
