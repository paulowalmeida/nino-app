import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

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

describe('TableTabsHeader', () => {
  it('titles the screen and offers to open a tab', () => {
    render(<TableTabsHeader />)

    expect(
      screen.getByRole('heading', { name: tableTabsHeaderMock.title })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: tableTabsHeaderMock.openLabel })
    ).toBeInTheDocument()
  })

  it('opens and closes the dialog for a new tab', async () => {
    render(<TableTabsHeader />)

    await userEvent.click(
      screen.getByRole('button', { name: tableTabsHeaderMock.openLabel })
    )
    await userEvent.click(screen.getByRole('button', { name: 'fechar diálogo' }))

    expect(
      screen.queryByRole('button', { name: 'fechar diálogo' })
    ).not.toBeInTheDocument()
  })
})
